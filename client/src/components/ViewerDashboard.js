import React, { Component } from 'react';
import {Box, Typography} from "@mui/material";
import {Viewer} from './Viewer'

export const ViewerDashboard = (props) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>

            {/* Header */}
            {/* <Typography sx={{ flexShrink: 0, backgroundColor: 'darkgrey', p: 1 }}> Header </Typography> */}

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex' }}>

                {/* Sidebar */}
                {/* <Typography sx={{ flexShrink: 0, width: '10rem', backgroundColor: 'rosybrown', p: 1 }}> Sidebar </Typography> */}

                {/* Viewer */}
                <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    <Viewer />
                </Box>
            </Box>

            {/* Control Panel */}
            <Typography sx={{ flexShrink: 0, backgroundColor: 'lightsalmon', p: 1 }}> Control Panel </Typography>
        </Box>
    );
}