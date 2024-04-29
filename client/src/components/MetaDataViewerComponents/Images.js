import * as THREE from "three";
import * as AMI from 'ami.js';

import React, {useEffect, useRef} from "react";
import {
   Box, Divider, FormControlLabel, FormGroup, Stack, Switch, Typography
} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as viewerHelper from '../../helpers/viewerHelper';
import {fetchAndAddActivityMapToViewer, removeActivityMapFromViewer} from "../../redux/actions";
import {STACK_HELPER_BORDER_COLOR} from "../../settings";
import {DIRECTIONS} from "../../constants";
import {
  getNewSliceIndex, updateStackHelperIndex
} from "../../helpers/stackHelper";
import {getActivityMapsDiff, postProcessActivityMap, updateLUT} from "../../helpers/activityMapHelper";
import {sceneObjects} from "../../redux/constants";
import {HomeIcon, KeyboardArrowUpIcon, TonalityIcon} from "../../icons";
import variables from "../../theme/variables";


const {primaryActiveColor, headerBorderColor, headerBorderLeftColor, headingColor} = variables;

const StackHelper = AMI.stackHelperFactory(THREE);

const DELTA_SLICE_BUTTON = 1 ;
const DELTA_SLICE_MOUSE = 5;

const filterDictByKeys = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));

const Images = () => {
  const dispatch = useDispatch();
  
  const activeAtlas = useSelector(state => state.viewer.atlas);
  const activeActivityMaps = useSelector(state => state.viewer.activityMaps);
  const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);
  const atlasActivityMaps = useSelector( state => state.model.AtlasActivityMap );
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [wireframeMode, setWireframeMode] = React.useState(false);
  const [sliceIndex, setSliceIndex] = React.useState(null);
  
  
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  
  const currentAtlasStackHelperRef = useRef(null);
  const activityMapsStackHelpersRef = useRef({});
  
  const previousAtlasIdRef = useRef(null);
  const activityMapsRef = useRef(activeActivityMaps);
  
  // On Mount
  useEffect(() => {
    initViewer();
    animate();
    subscribeEvents();
    return () => {
      unSubscribeEvents();
    };
  }, []);
  
  const initViewer = () => {
    rendererRef.current = viewerHelper.initRenderer(containerRef);
    sceneRef.current = viewerHelper.initScene();
    cameraRef.current = viewerHelper.getOrthographicCamera(containerRef);
    sceneRef.current.add(cameraRef.current);
    controlsRef.current = viewerHelper.getControls(cameraRef.current, containerRef.current);
    cameraRef.current.controls = controlsRef.current;
  };
  
  const animate = () => {
    controlsRef.current.update();
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    
    requestAnimationFrame(function () {
      animate();
    });
  };
  
  const subscribeEvents = () => {
    containerRef.current.addEventListener('wheel', handleScroll);
    window.addEventListener('resize', onWindowResize);
  };
  
  const unSubscribeEvents = () => {
    containerRef.current?.removeEventListener('wheel', handleScroll);
    window.removeEventListener('resize', onWindowResize);
  };
  
  const onWindowResize = (event) => {
    viewerHelper.resize(containerRef, rendererRef, cameraRef)
  }
  
  const handleScroll = (event) => {
    const direction = event.deltaY < 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
    const currentAtlas = currentAtlasStackHelperRef.current;
    handleScrollHelper(currentAtlas, direction, DELTA_SLICE_MOUSE);
  };
  
  const handleScrollHelper = (atlas, direction, delta) => {
    const newIndex = getNewSliceIndex(atlas, direction, delta);
    if (newIndex !== null) {
      setSliceIndex(newIndex);
    }
  }
  
  const groupByHierarchy = (activityMaps, experimentId) => {
    const grouped = {};
    
    //add the parent experimentId as level in case the flag is true
    
    Object.entries(activityMaps).forEach(([key, value]) => {
      if ( value.experiment && experimentId && value.hierarchy.indexOf(experimentId) == -1 )
        value.hierarchy.unshift(experimentId);
    });
    
    Object.entries(activityMaps).forEach(([key, value]) => {
      // Convert the hierarchy array into a string to use as a key
      const hierarchyKey = value?.hierarchy.join(', ');
      
      if (!grouped[hierarchyKey]) {
        grouped[hierarchyKey] = [];
      }
      
      // Add the entire entry, including the key if necessary
      grouped[hierarchyKey].push({...value, key});
    });
    
    return grouped;
  }
  
  
  const updateAllStackHelpersIndex = (newIndex) => {
    // Update the atlas
    updateStackHelperIndex(currentAtlasStackHelperRef.current, newIndex);
    
    // Update the activity maps to match the atlas index
    Object.values(activityMapsStackHelpersRef.current).forEach(stackHelper => {
      updateStackHelperIndex(stackHelper, newIndex);
    });
  };
  
  const handlePreviousSlice = () => {
    if (sliceIndex && sliceIndex > 0) {
      handleScrollHelper(currentAtlasStackHelperRef.current, DIRECTIONS.DOWN, DELTA_SLICE_BUTTON);
    }
  };
  
  const handleNextSlice = () => {
    const currentAtlas = currentAtlasStackHelperRef.current;
    if (sliceIndex && currentAtlas && sliceIndex < currentAtlas.orientationMaxIndex - 1) {
      handleScrollHelper(currentAtlasStackHelperRef.current, DIRECTIONS.UP, DELTA_SLICE_BUTTON);
    }
  };
  
  const handleCenterStack = () => {
    const currentAtlas = currentAtlasStackHelperRef.current;
    if (currentAtlas) {
      const centerIndex = Math.floor(currentAtlas.stack._frame.length / 2);
      setSliceIndex(centerIndex);
    }
  };
  
  // handle slice index changes
  useEffect(() => {
    if (sliceIndex !== null) {
      updateAllStackHelpersIndex(sliceIndex)
    }
  }, [sliceIndex]);
  
  
  // needed for the handle wheel event listener
  useEffect(() => {
    activityMapsRef.current = activeActivityMaps;
  }, [activeActivityMaps]);
  
  
  // On atlas changes
  useEffect(() => {
    if (activeAtlas) {
      const hasAtlasChanged = previousAtlasIdRef.current !== activeAtlas.id;
      
      if(hasAtlasChanged){
        viewerHelper.updateCamera(containerRef.current, cameraRef.current, activeAtlas.stack);
        previousAtlasIdRef.current =activeAtlas.id;
      }
      
      const targetStack = wireframeMode ? activeAtlas.wireframeStack : activeAtlas.stack;
      
      // Check if the current atlas is different from the active atlas or if wireframe mode has changed.
      const currentAtlasHasChanged = !currentAtlasStackHelperRef.current || currentAtlasStackHelperRef.current.atlasId !== activeAtlas.id;
      const wireframeModeHasChanged = currentAtlasStackHelperRef.current && currentAtlasStackHelperRef.current.isWireframe !== wireframeMode;
      
      if (currentAtlasHasChanged || wireframeModeHasChanged) {
        const stackHelper = new StackHelper(targetStack);
        stackHelper.name = sceneObjects.ATLAS;
        stackHelper.isWireframe = wireframeMode;
        stackHelper.bbox.visible = false;
        stackHelper.border.color = STACK_HELPER_BORDER_COLOR;
        stackHelper.orientation = cameraRef.current.stackOrientation;
        
        if (currentAtlasHasChanged) {
          // If the atlas has changed, center the index
          const centerIndex = Math.floor(stackHelper.stack._frame.length / 2);
          setSliceIndex(centerIndex);
        } else if (wireframeModeHasChanged && sliceIndex !== null) {
          // If only the wireframe mode has changed, use the stored slice index
          updateStackHelperIndex(stackHelper, sliceIndex);
        }
        
        stackHelper.visible = activeAtlas.visibility;
        stackHelper.atlasId = activeAtlas.id;
        
        if (currentAtlasStackHelperRef.current) {
          sceneRef.current.remove(currentAtlasStackHelperRef.current);
        }
        sceneRef.current.add(stackHelper);
        currentAtlasStackHelperRef.current = stackHelper;
        
        // FIXME: Workaround to get the atlas always on the bottom
        
        // Store all activity maps temporarily and remove them from the scene
        const tempActivityMaps = [];
        Object.keys(activityMapsStackHelpersRef.current).forEach(activityMapID => {
          tempActivityMaps.push(activityMapsStackHelpersRef.current[activityMapID]);
          sceneRef.current.remove(activityMapsStackHelpersRef.current[activityMapID]);
        });
        //  Add back the activity maps
        tempActivityMaps.forEach(activityMapStackHelper => {
          sceneRef.current.add(activityMapStackHelper);
        });
      } else {
        currentAtlasStackHelperRef.current.visible = activeAtlas.visibility;
      }
    }
  }, [activeAtlas, wireframeMode]);
  
  
  // Handle activityMap changes
  useEffect(() => {
    const {activityMapsToAdd, activityMapsToRemove} = getActivityMapsDiff(activeActivityMaps,
      activityMapsStackHelpersRef);
    
    // Process removals
    activityMapsToRemove.forEach(amIdToRemove => {
      const stackHelperToRemove = activityMapsStackHelpersRef.current[amIdToRemove];
      if (stackHelperToRemove) {
        sceneRef.current.remove(stackHelperToRemove);
        delete activityMapsStackHelpersRef.current[amIdToRemove];
      }
    });
    
    // Process changes
    
    Object.keys(activityMapsStackHelpersRef.current).forEach(amID => {
      const activityMap = activeActivityMaps[amID];
      if (activityMap) {
        const activityMapStackHelper = activityMapsStackHelpersRef.current[amID]
        // change visibility
        if (activityMapStackHelper.visible !== activityMap.visibility) {
          activityMapStackHelper.visible = activityMap.visibility
        }
        // change LUT
        if (activityMapStackHelper.colorRange !== JSON.stringify(activityMap.colorRange) ||
          activityMapStackHelper.intensityRange !== JSON.stringify(activityMap.intensityRange)) {
          updateLUT(activityMap.colorRange, activityMap.intensityRange, activityMapStackHelper)
        }
      }
    })
    
    
    // Process additions
    activityMapsToAdd.forEach(amIdToAdd => {
      const activityMap = activeActivityMaps[amIdToAdd];
      let stackHelper = new StackHelper(activityMap.stack);
      stackHelper.name = sceneObjects.ACTIVITY_MAP
      stackHelper = postProcessActivityMap(stackHelper, activityMap, cameraRef.current.stackOrientation,
        currentAtlasStackHelperRef.current.index);
      
      sceneRef.current.add(stackHelper);
      // Store the stackHelper in the ref object
      activityMapsStackHelpersRef.current[amIdToAdd] = stackHelper;
    });
    
    
  }, [activeActivityMaps]);
  
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return <>
    <Stack spacing='1.5rem'>
      <Box px={2} pt={1.25}>
        {[activeAtlas].map((atlas, atlasIndex) => {
          const selectedAtlasActivityMaps = atlas?.id && atlasActivityMaps[atlas.id] ? atlasActivityMaps[atlas.id] : [];
          const filteredActivityMaps = filterDictByKeys(activityMapsMetadata, selectedAtlasActivityMaps);
          const groupByHierarchyActivityMaps = groupByHierarchy(filteredActivityMaps, atlas?.id);
          return Object.keys(groupByHierarchyActivityMaps).map((activityMapKey, activityMapIndex) => (
            <Box key={activityMapKey + activityMapIndex}>
              {atlasIndex !== 0 && (
                <Divider sx={{ mt: 1.5, mb: 1, background: headerBorderLeftColor }} />
              )}
              <Box sx={{
                mt: 1, // Add some top margin for spacing
                ml: 1, // Start with a base left margin
                background: headerBorderColor,
              }}>
                {activityMapKey.split(',').map((level, index) => (
                  <Typography
                    key={index}
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      lineHeight: '150%',
                      color: headingColor,
                      mt: `${index * 0.5}rem`, // Increment top margin for each new line
                      ml: `${index * 2}rem`, // Increment left margin to simulate tabbing effect
                    }}>
                    {level}
                  </Typography>
                ))}
              </Box>
              <FormGroup>
                {groupByHierarchyActivityMaps[activityMapKey].map((activityMap, mapIndex) => (
                  <Box
                    key={activityMap.key + mapIndex}
                    sx={{
                      position: 'relative',
                      paddingLeft: '0.25rem',
                      ml: `${activityMapKey.split(',').length * 2}rem`, // Calculate left margin based on hierarchy depth
                      '&:hover:before': {
                        background: primaryActiveColor,
                      },
                      '&:before': {
                        content: '""',
                        height: '100%',
                        width: '0.125rem',
                        background: headerBorderColor,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!activeActivityMaps[activityMap.key]}
                          onChange={(event) => {
                            if (event.target.checked) {
                              dispatch(fetchAndAddActivityMapToViewer(activityMap.name));
                              handlePopoverClose();
                            } else {
                              dispatch(removeActivityMapFromViewer(activityMap.name));
                            }
                          }}
                        />
                      }
                      labelPlacement="start"
                      label={activityMap.name}
                    />
                  </Box>
                ))}
              </FormGroup>
            </Box>
          ));
        })}
      </Box>
    </Stack>
  </>
}

export default Images