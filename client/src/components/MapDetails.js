import React from 'react';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

const MapSection = ({ mapText }) => (
    <Stack spacing='.5rem' direction='row'>
        <Typography variant='h5' color='#8D8D91'>Map</Typography>
        <Typography variant='h5' color='#FCFCFD'>{mapText}</Typography>
    </Stack>
);

const IntensityValueSection = ({ intensityValue }) => (
    <Stack spacing='.5rem' direction='row'>
        <Typography variant='h5' color='#8D8D91'>Map’s intensity value</Typography>
        <Typography variant='h5' color='#FCFCFD'>{intensityValue}</Typography>
    </Stack>
);

const MapDetails = ({ brainRegion, coordinates, maps, intensityValues }) => {
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
       id='test'
       sx={{
           position: "absolute",
           zIndex: 10,
           bottom: 0
       }}
    >
        <Stack spacing='.5rem' direction='row'>
            <Typography variant='h5' color='#8D8D91'>Brain region</Typography>
            <Typography variant='h5' color='#FCFCFD'>{brainRegion}</Typography>
        </Stack>
        <Stack spacing='.5rem' direction='row'>
            <Typography variant='h5' color='#8D8D91'>Voxels (x,y,z)</Typography>
            <Typography variant='h5' color='#FCFCFD'>{`${coordinates?.x}, ${coordinates?.y}, ${coordinates?.z}`}</Typography>
        </Stack>
        <Stack spacing='.25rem'>
            {maps.map((mapText, index) => (
                <MapSection key={index} mapText={mapText}/>
            ))}
        </Stack>
        <Stack spacing='.25rem'>
            {intensityValues.map((intensityValue, index) => (
                <IntensityValueSection key={index} intensityValue={intensityValue.toFixed(2)}/>
            ))}
        </Stack>
    </Stack>)
};

export default MapDetails;
