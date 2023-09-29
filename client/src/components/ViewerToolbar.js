import React from 'react';
import { IconButton, Stack, Tooltip } from "@mui/material";
import { KeyboardArrowDownIcon, KeyboardArrowUpIcon, HomeIcon, ZoomInIcon, ZoomOutIcon, TonalityIcon, AutoModeIcon } from '../icons';
import vars from '../theme/variables';

const options = ['Previous slice', 'Center stack', 'Next slice', 'Auto scroll through slices', 'Zoom in', 'Zoom out', 'Switch to wireframe']
export const ViewerToolbar = () => {

    const handleClick = (id) => {
        console.log("id: ", options[id])
    }
    return (
        <Stack spacing={0.5} sx={{
            '& .MuiIconButton-root': {
                padding: '4px',
                '&:hover': {
                    backgroundColor: vars.headerBorderColor,
                    borderRadius: '8px'
                }
            },
            '& .MuiSvgIcon-root': {
                width: 'auto', 
                height: 'auto'
            }
        }}>
            <Tooltip title="Previous slice" placement="right">
                <IconButton onClick={() => handleClick(0)}>
                    <KeyboardArrowUpIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Center stack" placement="right">
                <IconButton onClick={() => handleClick(1)}>
                    <HomeIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Next slice" placement="right">
                <IconButton onClick={() => handleClick(2)}>
                    <KeyboardArrowDownIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Auto scroll through slices" placement="right">
                <IconButton onClick={() => handleClick(3)}>
                    <AutoModeIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Zoom in" placement="right">
                <IconButton onClick={() => handleClick(4)}>
                    <ZoomInIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Zoom out" placement="right">
                <IconButton onClick={() => handleClick(5)}>
                    <ZoomOutIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Switch to wireframe" placement="right">
                <IconButton onClick={() => handleClick(6)}>
                    <TonalityIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
        </Stack>
    );
}