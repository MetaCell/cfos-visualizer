import {Box} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;
  
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: '0 1.5rem 1.5rem' }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default CustomTabPanel