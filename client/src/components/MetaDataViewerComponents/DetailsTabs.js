import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import variables from "../../theme/variables";

const{ gray100} = variables
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DetailsTabs = ({ handleChange, value }) => {
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="detsils-tabs"
          sx={{
            padding: '0rem 0.75rem 0.25rem 0.75rem',
            '& .MuiButtonBase-root': {
              fontSize: '0.875rem !important',
              padding: '.88rem',
              
              '&.Mui-selected': {
                color: gray100,
              }
            }
           }}>
          <Tab disableRipple label="Details" {...a11yProps(0)}  />
          <Tab disableRipple label="Images" {...a11yProps(1)} />
          <Tab disableRipple label="Experiments sharing the same atlas" {...a11yProps(2)} />
        </Tabs>
      </Box>
     
    </Box>
  );
}

export default DetailsTabs