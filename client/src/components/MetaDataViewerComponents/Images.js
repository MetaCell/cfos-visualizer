import React from "react";
import {
  Box, Divider, FormControlLabel, Stack, Switch, Typography
} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import {fetchAndAddActivityMapToViewer, removeActivityMapFromViewer} from "../../redux/actions";
import variables from "../../theme/variables";
import {RichTreeView} from "@mui/x-tree-view/RichTreeView";
import {TreeItem} from "@mui/x-tree-view";


const {primaryActiveColor, headerBorderColor, gray300, gray50, gray200, gray25} = variables;

const filterDictByKeys = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));

const Images = () => {
  const dispatch = useDispatch();
  
  const activeAtlas = useSelector(state => state.viewer.atlas);
  const activeActivityMaps = useSelector(state => state.viewer.activityMaps);
  const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);
  const atlasActivityMaps = useSelector( state => state.model.AtlasActivityMap );
  const groupByHierarchy = (activityMaps, experimentId) => {
    const grouped = {};
    
    Object.entries(activityMaps).forEach(([_, value]) => {
      if ( value.experiment && experimentId && value.hierarchy.indexOf(experimentId) === -1 )
        value.hierarchy.unshift(experimentId);
    });
    
    Object.entries(activityMaps).forEach(([key, value]) => {
      // Convert the hierarchy array into a string to use as a key
      const hierarchyKey = value?.hierarchy?.join(', ');
      
      if (!grouped[hierarchyKey]) {
        grouped[hierarchyKey] = [];
      }
      
      // Add the entire entry, including the key if necessary
      grouped[hierarchyKey].push({...value, key});
    });
    
    return grouped;
  }
  const getData = () => {
    const atlas = activeAtlas;
    const selectedAtlasActivityMaps = atlas?.id && atlasActivityMaps[atlas.id] ? atlasActivityMaps[atlas.id] : [];
    const filteredActivityMaps = filterDictByKeys(activityMapsMetadata, selectedAtlasActivityMaps);
    const groupByHierarchyActivityMaps = groupByHierarchy(filteredActivityMaps, atlas?.id);
    const buildTree = (levels, maps, parentId) => {
      if (levels.length === 0) return null;
      
      const [currentLevel, ...remainingLevels] = levels;
      
      const node = {
        id: `${currentLevel}-${parentId}`,
        label: currentLevel,
        children: []
      };
      
      if (remainingLevels.length === 0) {
        node.children = maps.map((activityMap, mapIndex) => ({
          id: `${activityMap.name}-${mapIndex}`,
          label: activityMap.name
        }));
      } else {
        console.log(node)
        node.children.push(buildTree(remainingLevels, maps, node.id));
      }
      return node;
    };
    
    return Object.entries(groupByHierarchyActivityMaps).map(([activityMapKey, maps], index) => {
      const levels =  activityMapKey.split(',');
      return buildTree(levels, maps, index);
    });
  }
  
  return <Stack spacing='1.5rem'>
    <Stack spacing='.25rem'>
      <Typography color={gray25} variant='h4' fontWeight={400}>Atlas</Typography>
      <Typography color={gray300} variant='h4' fontWeight={400}>gubra_ano_combined_25um.nii.gz</Typography>
    </Stack>
    <Divider />
      <RichTreeView items={getData()} slots={{ item: (props) => <TreeItem
          {...props}
          sx={{
            marginTop: '.25rem',
            '& .MuiTreeItem-content': {
              '&:hover': {
                backgroundColor: 'transparent !important',
              },
              '&.Mui-focused': {
                backgroundColor: 'transparent !important',
              },
              '&.Mui-selected': {
                backgroundColor: 'transparent !important',
                '&:hover': {
                  backgroundColor: 'transparent !important',
                },
              }
            }
          }}
          label={props.children.length === 0 ? (
            <Box
              sx={{
                position: 'relative',
                paddingLeft: '0.25rem',
                '& .MuiTypography-root': {
                  color: gray200,
                  fontSize: '0.875rem',
                  marginLeft: '-1.75rem',
                },
                '&:hover': {
                  '&:before': {
                    background: primaryActiveColor,
                  }
                },
                '&:before': {
                  content: '""',
                  height: '100%',
                  width: '0.125rem',
                  background: headerBorderColor,
                  position: 'absolute',
                  left: '-1.75rem',
                  top: '0',
                },
              }}
              key={props.itemId}
            >
              <FormControlLabel
                fontWeight="400"
                control={
                  <Switch
                    checked={!!activeActivityMaps[props.label]}
                    onChange={(event) => {
                      if (event.target.checked) {
                        dispatch(fetchAndAddActivityMapToViewer(props.label));
                      } else {
                        dispatch(removeActivityMapFromViewer(props.label));
                      }
                    }}
                  />
                }
                labelPlacement="start"
                label={props.label}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='h4' color={gray50} fontWeight={400} sx={{
                '&:before': {
                  content: '""',
                  height: '100%',
                  width: '0.125rem',
                  background: headerBorderColor,
                  position: 'absolute',
                  left: '-1.8rem',
                  top: '0',
                },
                '&:hover': {
                  '&:before': {
                    background: primaryActiveColor,
                  }
                },
              }}>
                {props.label}
              </Typography>
            </Box>
          )}
        />
      }} />
    </Stack>
 
}

export default Images