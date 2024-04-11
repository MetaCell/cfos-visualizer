import React from 'react';
import {Box, Typography} from "@mui/material";

export const MetadataViewer = () =>
{
    const loadingMessage = 'Loading metadata...';

    return (
        <>
            <Box id='darioDetails' sx={ { display: 'flex', flexDirection: 'column', height: '100%', width: '100%' } }>
                <Typography mt={2} variant="h6">{loadingMessage}</Typography>
            </Box>
        </>
    )
};
