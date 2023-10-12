import React from 'react';
import { IconButton, Stack, Tooltip } from "@mui/material";
import { KeyboardArrowDownIcon, KeyboardArrowUpIcon, HomeIcon, ZoomInIcon, ZoomOutIcon, TonalityIcon, TonalityIconInverted, AutoModeIcon } from '../icons';
import vars from '../theme/variables';
import { toggleWireframe } from '../redux/actions';
import {useDispatch, useSelector} from "react-redux";

export const ViewerToolbar = () => {

    const dispatch = useDispatch();
    const wireframe = useSelector(state => state.viewer.wireframe);

    const options = [
        {
            title: "Previous slice",
            Icon: <KeyboardArrowUpIcon />,
            onClickFunc: () => console.log("Previous slice"),
            isVisible: true
        },
        {
            title: "Center stack",
            Icon: <HomeIcon />,
            onClickFunc: () => console.log("Center stack"),
            isVisible: true
        },
        {
            title: "Next slice",
            Icon: <KeyboardArrowDownIcon />,
            onClickFunc: () => console.log("Next slice"),
            isVisible: true
        },
        {
            title: "Auto scroll through slices",
            Icon: <AutoModeIcon />,
            onClickFunc: () => console.log("Auto scroll through slices"),
            isVisible: true
        },
        {
            title: "Zoom in",
            Icon: <ZoomInIcon />,
            onClickFunc: () => console.log("Zoom in"),
            isVisible: true
        },
        {
            title: "Zoom out",
            Icon: <ZoomOutIcon />,
            onClickFunc: () => console.log("Zoom out"),
            isVisible: true
        },
        {
            title: "Toggle wireframe",
            Icon: wireframe ? <TonalityIconInverted /> : <TonalityIcon />,
            onClickFunc: () => { dispatch(toggleWireframe()) },
            isVisible: true
        }
    ]

    return (
        <Stack spacing={0.5} sx={{
            '& .MuiIconButton-root': {
                padding: '0.25rem',
                '&:hover': {
                    backgroundColor: vars.headerBorderColor,
                    borderRadius: '0.5rem'
                }
            },
            '& .MuiSvgIcon-root': {
                width: 'auto',
                height: 'auto'
            }
        }}>
            {
                options.map((option) => option.isVisible && (
                    <Tooltip key={option.title} title={option.title} placement="right">
                        <IconButton onClick={option.onClickFunc}>
                            {option.Icon}
                        </IconButton>
                    </Tooltip>
                ))
            }
        </Stack>
    );
}