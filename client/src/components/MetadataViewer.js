import React from 'react';
import { Box, Stack } from "@mui/material";
import {CustomAlert} from "./MetaDataViewerComponents/CustomAlert";
import DetailsTabs from "./MetaDataViewerComponents/DetailsTabs";
import CustomTabPanel from "./MetaDataViewerComponents/CustomTabPanel";
import Detail from "./MetaDataViewerComponents/Detail";
import {Publications} from "./MetaDataViewerComponents/Publications";
import details from '../data/details.json'

export const MetadataViewer = () => {
  let [tabValue, setTabValue] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);
  
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  const viewOtherExperiences = () => {
    setTabValue(2)
  }
  
  const renderComponent = (key, value) => {
   
    if (typeof value === 'string') {
      return <Detail title={key} text={value} />;
    } else if (typeof value === 'object') {
      return <Publications title={key} value={value} /> ;
    } else {
      return null;
    }
  };
  
  const renderDetails = () => {
    return Object.entries(details).map(([key, value]) => (
      <React.Fragment key={key}>
        {renderComponent(key, value)}
      </React.Fragment>
    ));
  };
  return (
    <Stack
      id='details'
      spacing={'1.5rem'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
        <Stack spacing='1.5rem'>
          {renderDetails()}
        </Stack>
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
