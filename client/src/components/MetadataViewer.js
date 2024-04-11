import React from 'react';
import { Box, Stack } from "@mui/material";
import {CustomAlert} from "./MetaDataViewerComponents/CustomAlert";
import DetailsTabs from "./MetaDataViewerComponents/DetailsTabs";
import CustomTabPanel from "./MetaDataViewerComponents/CustomTabPanel";
export const MetadataViewer = () => {
  let [tabValue, setTabValue] = React.useState(0);
  
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  const viewOtherExperiences = () => {
    setTabValue(2)
  }
  return (
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
        <CustomAlert viewOtherExperiences={viewOtherExperiences} />
      </Box>
      <DetailsTabs value={tabValue} handleChange={handleChangeTab} />
      <CustomTabPanel value={tabValue} index={0}>
        Details
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        Images
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        Experiments sharing the same atlas
      </CustomTabPanel>
    </Stack>
  )
};
