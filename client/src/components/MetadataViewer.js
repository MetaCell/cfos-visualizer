import React from 'react';
import { Stack } from "@mui/material";
import {CustomAlert} from "./MetaDataViewerComponents/CustomAlert";

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
         padding: '1.5rem'
       }}>
        <CustomAlert />
      </Stack>
    </>
  )
};
