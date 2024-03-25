import * as THREE from "three";
import * as AMI from 'ami.js';

import React, {useEffect, useRef} from "react";
import {
    Box
} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as viewerHelper from '../../helpers/viewerHelper';

import {ViewerToolbar} from "./ViewerToolbar";
import {fetchAndAddActivityMapToViewer, removeActivityMapFromViewer} from "../../redux/actions";
import {STACK_HELPER_BORDER_COLOR} from "../../settings";
import {DIRECTIONS} from "../../constants";
import {
    getNewSliceIndex, updateStackHelperIndex
} from "../../helpers/stackHelper";
import {getActivityMapsDiff, postProcessActivityMap, updateLUT} from "../../helpers/activityMapHelper";
import {sceneObjects} from "../../redux/constants";
import {HomeIcon, KeyboardArrowUpIcon, TonalityIcon} from "../../icons";
import PopoverMenu from "./PopoverMenu";

const StackHelper = AMI.stackHelperFactory(THREE);

export const Viewer = (props) => {

    const dispatch = useDispatch();

    const activeAtlas = useSelector(state => state.viewer.atlas);
    const activeActivityMaps = useSelector(state => state.viewer.activityMaps);
    const experimentsActivityMaps = useSelector(state => state.model.ExperimentsActivityMap);
    const currentExperiment = useSelector(state => state.currentExperiment);
    const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);

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

        const newIndex = getNewSliceIndex(currentAtlas, direction);
        if (newIndex !== null) {
            setSliceIndex(newIndex);
        }
    };


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
            setSliceIndex(sliceIndex - 1);
        }
    };

    const handleNextSlice = () => {
        const currentAtlas = currentAtlasStackHelperRef.current;
        if (sliceIndex && currentAtlas && sliceIndex < currentAtlas.orientationMaxIndex - 1) {
            setSliceIndex(sliceIndex + 1)
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
            viewerHelper.updateCamera(containerRef.current, cameraRef.current, activeAtlas.stack);

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
                stackHelper.slice.opacity = activeAtlas.opacity;

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
                currentAtlasStackHelperRef.current.slice.opacity = activeAtlas.opacity;
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
                if (activityMapStackHelper.colorGradient !== JSON.stringify(activityMap.colorGradient) ||
                    activityMapStackHelper.opacityGradient !== JSON.stringify(activityMap.opacityGradient)) {
                    updateLUT(activityMap.colorGradient, activityMap.opacityGradient, activityMapStackHelper)
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


    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const orderedExperiments = [currentExperiment?.id, ...Object.keys(experimentsActivityMaps)
        .filter(experiment => experiment !== currentExperiment?.id)];

    const toolbarOptions = [
        {
            title: "Previous slice",
            Icon: <KeyboardArrowUpIcon />,
            onClickFunc: handlePreviousSlice,
            isVisible: true
        },
        {
            title: "Center stack",
            Icon: <HomeIcon />,
            onClickFunc: handleCenterStack,
            isVisible: true
        },
        {
            title: "Next slice",
            Icon: <KeyboardArrowDownIcon />,
            onClickFunc: handleNextSlice,
            isVisible: true
        },
        // {
        //     title: "Auto scroll through slices",
        //     Icon: <AutoModeIcon />,
        //     onClickFunc: () => console.log("Auto scroll through slices"),
        //     isVisible: true
        // },
        // {
        //     title: "Zoom in",
        //     Icon: <ZoomInIcon />,
        //     onClickFunc: () => console.log("Zoom in"),
        //     isVisible: true
        // },
        // {
        //     title: "Zoom out",
        //     Icon: <ZoomOutIcon />,
        //     onClickFunc: () => console.log("Zoom out"),
        //     isVisible: true
        // },
        {
            title: "Switch to wireframe",
            Icon: <TonalityIcon />,
            onClickFunc: () => setWireframeMode(prevMode => !prevMode),
            isVisible: true
        }
    ]

    const isOpen = Boolean(anchorEl);
    const popoverID = isOpen ? 'simple-popover' : undefined;

    return (
        <Box sx={{position: "relative", height: "100%", width: "100%"}}>
            <ViewerToolbar options={toolbarOptions} />
            <PopoverMenu
                isOpen={Boolean(anchorEl)}
                handlePopoverClose={handlePopoverClose}
                orderedExperiments={Object.keys(experimentsActivityMaps)} 
                experimentsActivityMaps={experimentsActivityMaps}
                currentExperiment={currentExperiment}
                activityMapsMetadata={activityMapsMetadata}
                dispatch={dispatch}
                fetchAndAddActivityMapToViewer={fetchAndAddActivityMapToViewer}
                removeActivityMapFromViewer={removeActivityMapFromViewer}
                anchorEl={anchorEl}
                activeActivityMaps={activeActivityMaps}
                handlePopoverOpen={handlePopoverOpen}
            />
            <Box sx={{position: "absolute", top: 0, left: 0, height: "100%", width: "100%",}}
                 ref={containerRef}>
            </Box>
        </Box>
    );
};