import React from 'react';
import { IconButton, Stack, Tooltip } from "@mui/material";
import { KeyboardArrowDownIcon, KeyboardArrowUpIcon, HomeIcon, ZoomInIcon, ZoomOutIcon, TonalityIcon, AutoModeIcon } from '../icons';
import vars from '../theme/variables';

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
        title: "Switch to wireframe",
        Icon: <TonalityIcon />,
        onClickFunc: () => console.log("Switch to wireframe"),
        isVisible: true
    }
]
export const ViewerToolbar = () => {

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
                    <Tooltip key={option.title} open={true} title={option.title} placement="right">
                        <IconButton onClick={option.onClickFunc}>
                            {option.Icon}
                        </IconButton>
                    </Tooltip>
                ))
            }
        </Stack>
    );
}