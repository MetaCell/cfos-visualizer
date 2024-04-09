import * as THREE from "three";
import * as AMI from 'ami.js';

import React, {useEffect, useRef, useState} from "react";
import {
    Badge, Box, Button, Chip, Divider, FormControlLabel, FormGroup, Popover, Switch, Typography
} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as viewerHelper from '../helpers/viewerHelper';
import vars from "../theme/variables";
import {ViewerToolbar} from "./ViewerToolbar";
import {ViewerProbe} from "./ViewerProbe";
import {fetchAndAddActivityMapToViewer, removeActivityMapFromViewer} from "../redux/actions";
import {DELTA_SLICE_BUTTON, DELTA_SLICE_MOUSE, STACK_HELPER_BORDER_COLOR} from "../settings";
import {DIRECTIONS} from "../constants";
import {
    getAtlasStackHelper,
    getNewSliceIndex, updateStackHelperIndex
} from "../helpers/stackHelper";
import {getActivityMapsDiff, postProcessActivityMap, updateLUT} from "../helpers/activityMapHelper";
import {sceneObjects} from "../redux/constants";
import {HomeIcon, KeyboardArrowUpIcon, TonalityIcon, ZoomInIcon, ZoomOutIcon} from "../icons";


const {primaryActiveColor, headerBorderColor, headerBg, headerButtonColor, headerBorderLeftColor, headingColor} = vars;

const StackHelper = AMI.stackHelperFactory(THREE);


export const Viewer = (props) => {

    const dispatch = useDispatch();

    const activeAtlas = useSelector(state => state.viewer.atlas);
    const activeActivityMaps = useSelector(state => state.viewer.activityMaps);
    const experimentsActivityMaps = useSelector(state => state.model.ExperimentsActivityMap);
    const currentExperiment = useSelector(state => state.currentExperiment);
    const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);

    const [anchorEl, setAnchorEl] = useState(null);
    const [wireframeMode, setWireframeMode] = useState(false);
    const [sliceIndex, setSliceIndex] = useState(null);

    const [probeVersion, setProbeVersion] = useState(0);


    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);

    const currentAtlasStackHelperRef = useRef(null);
    const currentAtlasWireframeStackHelperRef = useRef(null);
    const activityMapsStackHelpersRef = useRef({});

    const previousAtlasIdRef = useRef(null);
    const activityMapsRef = useRef(activeActivityMaps);

    const resizeObserverRef = useRef(null);


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
        window.addEventListener('wheel', handleScroll, {capture: true});
        window.addEventListener('resize', onWindowResize);
        resizeObserverRef.current = new ResizeObserver(entries => {
            for (const entry of entries) {
                onWindowResize();
            }
        });
        if (containerRef.current) {
            resizeObserverRef.current.observe(containerRef.current);
        }
    };

    const unSubscribeEvents = () => {
        window.removeEventListener('wheel', handleScroll);
        window.removeEventListener('resize', onWindowResize);
        if (resizeObserverRef.current) {
            resizeObserverRef.current.disconnect();
        }
    };

    const onWindowResize = () => {
        viewerHelper.resize(containerRef, rendererRef, cameraRef)
    }

    const handleScroll = (event) => {
        if (!containerRef.current) return;

        const bounds = containerRef.current.getBoundingClientRect();
        if (
            event.clientX >= bounds.left &&
            event.clientX <= bounds.right &&
            event.clientY >= bounds.top &&
            event.clientY <= bounds.bottom
        ) {
            handleScrollAux(event);
        }
    };
    const handleScrollAux = (event) => {
        const direction = event.deltaY < 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
        const currentAtlas = currentAtlasStackHelperRef.current;
        updateSliceIndex(currentAtlas, direction, DELTA_SLICE_MOUSE);
    };

    const updateSliceIndex = (atlas, direction, delta) => {
        const newIndex = getNewSliceIndex(atlas, direction, delta);
        if (newIndex !== null) {
            setSliceIndex(newIndex);
        }
    }


    const updateAllStackHelpersIndex = (newIndex) => {
        // Update the atlas
        updateStackHelperIndex(currentAtlasStackHelperRef.current, newIndex);
        updateStackHelperIndex(currentAtlasWireframeStackHelperRef.current, newIndex);

        // Update the activity maps to match the atlas index
        Object.values(activityMapsStackHelpersRef.current).forEach(stackHelper => {
            updateStackHelperIndex(stackHelper, newIndex);
        });
    };

    const handlePreviousSlice = () => {
        const currentAtlas = currentAtlasStackHelperRef.current;
        if (currentAtlas && sliceIndex && sliceIndex > 0) {
            updateSliceIndex(currentAtlas, DIRECTIONS.DOWN, DELTA_SLICE_BUTTON);
        }
    };

    const handleNextSlice = () => {
        const currentAtlas = currentAtlasStackHelperRef.current;
        if (currentAtlas, sliceIndex && sliceIndex < currentAtlas.orientationMaxIndex - 1) {
            updateSliceIndex(currentAtlas, DIRECTIONS.UP, DELTA_SLICE_BUTTON);
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

            if (hasAtlasChanged) {
                viewerHelper.updateCamera(containerRef.current, cameraRef.current, activeAtlas.stack);
                previousAtlasIdRef.current = activeAtlas.id;

                const stackHelper = getAtlasStackHelper(activeAtlas.stack, sceneObjects.ATLAS, activeAtlas.id,
                    cameraRef.current.stackOrientation);
                const stackHelperWireframe = getAtlasStackHelper(activeAtlas.wireframeStack, sceneObjects.ATLAS_WIREFRAME,
                    activeAtlas.id, cameraRef.current.stackOrientation
                );

                // If the atlas has changed, center the index
                const centerIndex = Math.floor(stackHelper.stack._frame.length / 2);
                setSliceIndex(centerIndex);

                stackHelper.visible = activeAtlas.visibility && !wireframeMode;
                stackHelperWireframe.visible = activeAtlas.visibility && wireframeMode

                if (currentAtlasStackHelperRef.current) {
                    sceneRef.current.remove(currentAtlasStackHelperRef.current);
                }
                if (currentAtlasWireframeStackHelperRef.current) {
                    sceneRef.current.remove(currentAtlasWireframeStackHelperRef.current);
                }
                sceneRef.current.add(stackHelper);
                sceneRef.current.add(stackHelperWireframe);

                currentAtlasStackHelperRef.current = stackHelper;
                currentAtlasWireframeStackHelperRef.current = stackHelperWireframe;

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
                currentAtlasStackHelperRef.current.visible = activeAtlas.visibility && !wireframeMode;
                currentAtlasWireframeStackHelperRef.current.visible = activeAtlas.visibility && wireframeMode;
            }
        }
    }, [activeAtlas]);


    useEffect(() => {
        if (currentAtlasStackHelperRef.current) {
            currentAtlasStackHelperRef.current.visible = activeAtlas.visibility && !wireframeMode;
        }
        if (currentAtlasWireframeStackHelperRef.current) {
            currentAtlasWireframeStackHelperRef.current.visible = activeAtlas.visibility && wireframeMode;
        }
    }, [wireframeMode])


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
            stackHelper = postProcessActivityMap(stackHelper, activityMap, cameraRef.current.stackOrientation);

            sceneRef.current.add(stackHelper);
            updateStackHelperIndex(stackHelper, sliceIndex)
            // Store the stackHelper in the ref object
            activityMapsStackHelpersRef.current[amIdToAdd] = stackHelper;
        });


    }, [activeActivityMaps]);

    useEffect(() => {
        if (currentAtlasStackHelperRef.current) {
            // FIXME: Workaround to fix initial handle misposition
            onWindowResize()
            setProbeVersion(prev => prev + 1)
        }
    }, [activeActivityMaps, activeAtlas, sliceIndex]);


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
            Icon: <KeyboardArrowUpIcon/>,
            onClickFunc: handlePreviousSlice,
            isVisible: true
        },
        {
            title: "Center stack",
            Icon: <HomeIcon/>,
            onClickFunc: handleCenterStack,
            isVisible: true
        },
        {
            title: "Next slice",
            Icon: <KeyboardArrowDownIcon/>,
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
            Icon: <TonalityIcon/>,
            onClickFunc: () => setWireframeMode(prevMode => !prevMode),
            isVisible: true
        }
    ]

    const isOpen = Boolean(anchorEl);
    const popoverID = isOpen ? 'simple-popover' : undefined;

    return (
        <Box sx={{position: "relative", height: "100%", width: "100%"}}>
            <Box sx={{position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 9}}>
                <ViewerToolbar options={toolbarOptions}/>
            </Box>
            <Badge badgeContent={activeActivityMaps.length} color="primary">
                <Button sx={{
                    '&.MuiButton-root': {
                        position: 'absolute',
                        right: '0.75rem',
                        height: '2.25rem',
                        borderRadius: '0.5rem',
                        border: `0.0625rem solid ${activeActivityMaps.length > 0}`,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: headerBg,
                        boxShadow: '0rem 0.0625rem 0.125rem 0rem rgba(16, 24, 40, 0.05)',
                        top: '0.75rem',
                        zIndex: 9,
                        gap: '0.5rem',
                        '&:hover': {
                            background: headerBorderColor
                        }
                    }
                }
                } aria-describedby={popoverID} variant="contained" onClick={handlePopoverOpen} disableRipple>
                    Statistical maps
                    <KeyboardArrowDownIcon sx={{fontSize: '1.25rem', color: headerButtonColor}}/>
                </Button>
            </Badge>

            <Popover
                id={popoverID}
                sx={{maxHeight: '20rem'}}
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom', horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top', horizontal: 'right',
                }}
            >
                <Box px={2} pt={1.25}>
                    {orderedExperiments.map((experimentName, experimentIndex) => {
                        const experimentActivityMaps = experimentsActivityMaps[experimentName] || [];
                        return (
                            <Box key={experimentName + experimentIndex}>
                                {experimentIndex !== 0 &&
                                    <Divider sx={{mt: 1.5, mb: 1, background: headerBorderLeftColor}}/>}
                                <Box sx={{
                                    height: '1.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: headerBorderColor,
                                    '& .MuiTypography-root': {
                                        fontSize: '0.75rem', fontWeight: 400, lineHeight: '150%', color: headingColor
                                    }
                                }}>
                                    <Typography>{experimentName}</Typography>
                                    {experimentIndex === 0 && currentExperiment && <Chip label="Current Experiment"/>}
                                </Box>
                                <FormGroup>
                                    {experimentActivityMaps.map((activityMapID, mapIndex) => (
                                        <Box
                                            key={activityMapID}
                                            sx={{
                                                position: 'relative', paddingLeft: '0.25rem', '&:hover': {
                                                    '&:before': {
                                                        background: primaryActiveColor,
                                                    }
                                                }, '&:before': {
                                                    content: '""',
                                                    height: '100%',
                                                    width: '0.125rem',
                                                    background: headerBorderColor,
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                },
                                            }}>
                                            <FormControlLabel
                                                key={activityMapID}
                                                control={
                                                    <Switch
                                                        checked={!!activeActivityMaps[activityMapID]}
                                                        onChange={(event) => {
                                                            if (event.target.checked) {
                                                                dispatch(fetchAndAddActivityMapToViewer(activityMapID));
                                                                handlePopoverClose()
                                                            } else {
                                                                dispatch(removeActivityMapFromViewer(activityMapID));
                                                            }
                                                        }}
                                                    />}
                                                labelPlacement="start"
                                                label={activityMapsMetadata[activityMapID]?.name}
                                            />
                                        </Box>))}
                                </FormGroup>
                            </Box>)
                    })}
                </Box>
            </Popover>
            {activeAtlas?.visibility && <ViewerProbe
                refs={{
                    stackHelperRef: currentAtlasStackHelperRef,
                    controlsRef: controlsRef,
                    activityMapsStackHelpersRef: activityMapsStackHelpersRef
                }}
                probeVersion={probeVersion}
            />}
            <Box sx={{position: "absolute", top: 0, left: 0, height: "100%", width: "100%",}}
                 ref={containerRef}>
            </Box>
        </Box>
    );
};