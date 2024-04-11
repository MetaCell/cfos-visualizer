import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import variables from "../../theme/variables";

const{ gray100} = variables
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DetailsTabs = () => {
  const [value, setValue] = React.useState(0);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="detsils-tabs"
          sx={{
            padding: '0rem 0.75rem 0.25rem 1.2rem',
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
      <CustomTabPanel value={value} index={0}>
        Details
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Images
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Experiments sharing the same atlas
      </CustomTabPanel>
    </Box>
  );
}

export default DetailsTabs