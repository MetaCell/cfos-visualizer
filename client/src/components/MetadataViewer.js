import React from 'react';
import {Box, Stack, Typography} from "@mui/material";

export const MetadataViewer = () =>
{
  const loadingMessage = 'Loading metadata...';

  return (
    <>
      <Stack
        id='experienceDetails'
        spacing={'1.5rem'}
         sx={{
         display: 'flex',
         flexDirection: 'column',
         height: '100%',
         width: '100%',
         padding: '1.5rem'
       }}>
          <Box padding={'1rem'} sx={{
            borderRadius: '0.75rem',
            border: '1px solid #1E1E1F',
            background: '#0F0F10'
          }}>
            <Typography>The selected atlas is associated with this experiment.</Typography>
            <Typography>See other associated experiments</Typography>
          </Box>
      </Stack>
    </>
  )
};
