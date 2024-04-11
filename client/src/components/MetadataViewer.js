import React from 'react';
import {Box, Stack} from "@mui/material";
import {CustomAlert} from "./MetaDataViewerComponents/CustomAlert";
import DetailsTabs from "./MetaDataViewerComponents/DetailsTabs";

export const MetadataViewer = () =>
{
  return (
    <>
      <Stack
        id='details'
        spacing={'1.5rem'}
         sx={{
         display: 'flex',
         flexDirection: 'column',
         height: '100%',
         width: '100%',
         padding: '1.5rem 0'
       }}>
        <Box p="0 1.5rem">
          <CustomAlert />
        </Box>
        <DetailsTabs />
      </Stack>
    </>
  )
};
