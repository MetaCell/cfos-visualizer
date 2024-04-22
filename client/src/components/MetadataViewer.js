import React from 'react';
import { Box, Stack } from "@mui/material";
import {CustomAlert} from "./MetaDataViewerComponents/CustomAlert";
import DetailsTabs from "./MetaDataViewerComponents/DetailsTabs";
import CustomTabPanel from "./MetaDataViewerComponents/CustomTabPanel";
import {Details} from "./MetaDataViewerComponents/Details";
import Experiments from "./MetaDataViewerComponents/Experiments";

export const MetadataViewer = () => {
  let [tabValue, setTabValue] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);
  
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
        width: '100%',
        padding: '1.5rem 0',
      }}>
      {
        openAlert &&   <Box p="0 1.5rem">
          <CustomAlert viewOtherExperiences={viewOtherExperiences} open={openAlert} setOpen={setOpenAlert} />
        </Box>
      }
      <DetailsTabs value={tabValue} handleChange={handleChangeTab} />
      <CustomTabPanel value={tabValue} index={0}>
        <Details />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        Images
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        <Experiments />
      </CustomTabPanel>
    </Stack>
  )
};
