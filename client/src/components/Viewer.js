import * as THREE from "three";
import * as AMI from 'ami.js';

import React, {useEffect, useRef} from "react";
import {
    Badge, Box, Button, Chip, Divider, FormControlLabel, FormGroup, Popover, Switch, Typography
} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as viewerHelper from '../helpers/viewerHelper';
import vars from "../theme/variables";
import {fetchAndAddActivityMapToViewer, removeActivityMapFromViewer} from "../redux/actions";
import {STACK_HELPER_BORDER_COLOR} from "../settings";
import {DIRECTIONS} from "../constants";
import {updateSlice, makeSliceTransparent} from "../helpers/stackHelper";
import {getActivtyMapsDiff, postProcessActivityMap} from "../helpers/activityMapHelper";


const {primaryActiveColor, headerBorderColor, headerBg, headerButtonColor, headerBorderLeftColor, headingColor} = vars;

const StackHelper = AMI.stackHelperFactory(THREE);


export const Viewer = (props) => {

    const dispatch = useDispatch();

    const atlas = useSelector(state => state.viewer.atlas);
    const activityMaps = useSelector(state => state.viewer.activityMaps);
    const experimentsActivityMap = useSelector(state => state.model.ExperimentsActivityMap);
    const currentExperiment = useSelector(state => state.currentExperiment);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const contronsRef = useRef(null);

    const currentAtlasStackHelperRef = useRef(null);
    const activityMapsStackHelpersRef = useRef({});

    const activityMapsRef = useRef(activityMaps);

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
        contronsRef.current = viewerHelper.getControls(cameraRef.current, containerRef.current);
        cameraRef.current.controls = contronsRef.current;
    };

    const animate = () => {
        contronsRef.current.update();
        rendererRef.current.render(sceneRef.current, cameraRef.current);

        requestAnimationFrame(function () {
            animate();
        });
    };

    const subscribeEvents = () => {
        containerRef.current.addEventListener('wheel', handleScroll);
    };

    const unSubscribeEvents = () => {
        containerRef.current?.removeEventListener('wheel', handleScroll);
    };

    const handleScroll = (event) => {
        const direction = event.deltaY < 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP
        updateSlice(currentAtlasStackHelperRef?.current, direction)
        Object.keys(activityMapsStackHelpersRef.current).forEach(activityMapID => {
            const stackHelper = activityMapsStackHelpersRef.current[activityMapID];
            const activityMap = activityMapsRef.current[activityMapID];
            updateSlice(stackHelper, direction);
            makeSliceTransparent(stackHelper, activityMap.opacity);
        });
    };

    // needed for the handle wheel event listener
    useEffect(() => {
        activityMapsRef.current = activityMaps;
    }, [activityMaps]);


    // On atlas changes
    useEffect(() => {
        if (atlas) {
            viewerHelper.updateCamera(containerRef.current, cameraRef.current, atlas.stack);

            const stackHelper = new StackHelper(atlas.stack);
            stackHelper.bbox.visible = false;
            stackHelper.border.color = STACK_HELPER_BORDER_COLOR;
            stackHelper.index = Math.floor(stackHelper.stack._frame.length / 2);
            stackHelper.orientation = cameraRef.current.stackOrientation;

            if (currentAtlasStackHelperRef.current?.stackHelper) {
                sceneRef.current.remove(currentAtlasStackHelperRef.current.stackHelper);
                // TODO: Remove activity maps too?
            }

            sceneRef.current.add(stackHelper);
            currentAtlasStackHelperRef.current = stackHelper
        }
    }, [atlas]);

    // Handle activityMap changes
    useEffect(() => {
        const {activityMapsToAdd, activityMapsToRemove} = getActivtyMapsDiff(activityMaps, activityMapsStackHelpersRef);

        // Process removals first
        activityMapsToRemove.forEach(amIdToRemove => {
            const stackHelperToRemove = activityMapsStackHelpersRef.current[amIdToRemove];
            if(stackHelperToRemove) {
                sceneRef.current.remove(stackHelperToRemove);
                delete activityMapsStackHelpersRef.current[amIdToRemove];
            }
        });

        // Process additions next
        activityMapsToAdd.forEach(amIdToAdd => {
            const activityMap = activityMaps[amIdToAdd];
            let stackHelper = new StackHelper(activityMap.stack);
            stackHelper = postProcessActivityMap(stackHelper, activityMap, cameraRef.current.stackOrientation,
                currentAtlasStackHelperRef.current.index);

            sceneRef.current.add(stackHelper);
            // Store the stackHelper in the ref object
            activityMapsStackHelpersRef.current[amIdToAdd] = stackHelper;
        });

    }, [activityMaps]);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const orderedExperiments = [currentExperiment?.id, ...Object.keys(experimentsActivityMap).filter(experiment => experiment !== currentExperiment?.id)];

    const isOpen = Boolean(anchorEl);
    const popoverID = isOpen ? 'simple-popover' : undefined;

    return (<Box sx={{position: "relative", height: "100%", width: "100%"}}>
        <Badge badgeContent={activityMaps.length} color="primary">
            <Button sx={{
                '&.MuiButton-root': {
                    position: 'absolute',
                    right: '0.75rem',
                    height: '2.25rem',
                    borderRadius: '0.5rem',
                    border: `0.0625rem solid ${activityMaps.length > 0}`,
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
            }} aria-describedby={popoverID} variant="contained" onClick={handlePopoverOpen} disableRipple>
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
                    const experimentActivityMaps = experimentsActivityMap[experimentName] || [];
                    return (<Box key={experimentName}>
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
                            {experimentActivityMaps.map((activityMapID, mapIndex) => (<Box key={activityMapID} sx={{
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
                                            checked={!!activityMaps[activityMapID]}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    dispatch(fetchAndAddActivityMapToViewer(activityMapID));
                                                } else {
                                                    dispatch(removeActivityMapFromViewer(activityMapID));
                                                }
                                            }}
                                        />}
                                    labelPlacement="start"
                                    label={activityMapID}
                                />
                            </Box>))}
                        </FormGroup>
                    </Box>)
                })}
            </Box>
        </Popover>
        <Box sx={{position: "absolute", top: 0, left: 0, height: "100%", width: "100%",}}
             ref={containerRef}>
            {/* <Typography> Viewer </Typography> */}
        </Box>
    </Box>);
};