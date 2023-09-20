import * as THREE from "three";
import * as AMI from 'ami.js';

import React, {useEffect, useRef} from "react";
import {Box, Typography} from "@mui/material";
import { useSelector } from "react-redux";
import * as viewerHelper from '../helpers/viewerHelper';
import {STACK_HELPER_BORDER_COLOR} from "../settings";

const StackHelper = AMI.stackHelperFactory(THREE);


export const Viewer = (props) => {
    const atlas = useSelector(state => state.viewer.atlas);
    const activityMaps = useSelector(state => state.viewer.activityMaps);

    const containerRef = useRef(null)
    const rendererRef = useRef(null)
    const sceneRef = useRef(null)
    const cameraRef = useRef(null)
    const contronsRef = useRef(null)

    const atlasRefs = useRef(null)

    // On Mount
    useEffect(() => {
        initViewer()
        animate()
        subscribeEvents()
        return () => {
            unSubscribeEvents()
        }
    }, []);

    const initViewer = () => {
        rendererRef.current = viewerHelper.initRenderer(containerRef);
        sceneRef.current = viewerHelper.initScene();
        cameraRef.current = viewerHelper.getOrthographicCamera(containerRef);
        sceneRef.current.add(cameraRef.current);
        contronsRef.current = viewerHelper.getControls(cameraRef.current, containerRef.current);
        cameraRef.current.controls = contronsRef.current;
    }

    const animate = () => {
        contronsRef.current.update();
        rendererRef.current.render(sceneRef.current, cameraRef.current);

        requestAnimationFrame(function () {
            animate();
        });
    };

    const subscribeEvents = () => {
        containerRef.current.addEventListener('wheel', handleScroll);
    }

    const unSubscribeEvents = () => {
        containerRef.current.removeEventListener('wheel', handleScroll);
    }

    const handleScroll = (event) => {
        // todo:
    }

    // On atlas changes
    useEffect(() => {
        if(atlas){
            const stackHelper = new StackHelper(atlas.stack);
            stackHelper.bbox.visible = false;
            stackHelper.border.color = STACK_HELPER_BORDER_COLOR;
            stackHelper.index = Math.floor(stackHelper.stack._frame.length / 2);

            sceneRef.current.add(stackHelper);
            viewerHelper.updateCamera(containerRef.current, cameraRef.current, stackHelper)

            stackHelper.orientation = cameraRef.current.stackOrientation

            atlasRefs.current = {
                ...atlasRefs.current,
                stackHelper
            };
        }


    }, [atlas]);


    return (
        <Box sx={{position: "relative", height: "100%", width: "100%"}}>
            <Box sx={{position: "absolute", top: 0, left: 0, height: "100%", width: "100%",}} ref={containerRef}>
                <Typography> Viewer </Typography>
            </Box>
        </Box>
    )
}