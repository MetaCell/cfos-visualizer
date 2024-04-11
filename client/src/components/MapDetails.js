import React from 'react';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import variables from "../theme/variables";
const {gray25, gray300} = variables

const MapSection = ({ mapText }) => (
    <Stack spacing='.5rem' direction='row'>
        <Typography variant='h5' color={gray300}>Map</Typography>
        <Typography variant='h5' color={gray25}>{mapText}</Typography>
    </Stack>
);

const IntensityValueSection = ({ intensityValue }) => (
    <Stack spacing='.5rem' direction='row'>
        <Typography variant='h5' color={gray300}>Map’s intensity value</Typography>
        <Typography variant='h5' color={gray25}>{intensityValue}</Typography>
    </Stack>
);

const MapDetails = ({ brainRegion, voxels, maps, intensityValues }) => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
    <Stack
       spacing='.5rem'
       direction={isLargeScreen || isSmallScreen ? 'column' : 'row'}
       alignItems={isLargeScreen || isSmallScreen ? 'flex-start' : 'flex-end'}
       justifyContent={isLargeScreen || isSmallScreen ? 'flex-start' : 'flex-end'}
       backgroundColor='#030203'
       width={1}
       p='.75rem'
    >
        <Stack spacing='.5rem' direction='row'>
            <Typography variant='h5' color={gray300}>Brain region</Typography>
            <Typography variant='h5' color={gray25}>{brainRegion}</Typography>
        </Stack>
        <Stack spacing='.5rem' direction='row'>
            <Typography variant='h5' color={gray300}>Voxels (x,y,z)</Typography>
            <Typography variant='h5' color={gray25}>{voxels}</Typography>
        </Stack>
        <Stack spacing='.25rem'>
            {maps.map((mapText, index) => (
                <MapSection key={index} mapText={mapText}/>
            ))}
        </Stack>
        <Stack spacing='.25rem'>
            {intensityValues.map((intensityValue, index) => (
                <IntensityValueSection key={index} intensityValue={intensityValue}/>
            ))}
        </Stack>
    </Stack>)
};

export default MapDetails;
