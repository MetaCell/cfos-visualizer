import React from 'react';
import { Box } from "@mui/material";
import { Viewer } from './Viewer';
import ControlPanel from './ControlPanel';

export const ViewerDashboard = ( props ) =>
{
    return (
        <>
            <Box
                sx={ { display: 'flex', flexDirection: 'column', height: '100%', width: '100%' } }
            >
                <Box sx={ { flex: 1, display: 'flex' } }>
                    <Box sx={ { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' } }>
                        <Viewer />
                    </Box>
                </Box>

                {/* Control Panel */ }
                <ControlPanel />
            </Box>
        </>
    );
};