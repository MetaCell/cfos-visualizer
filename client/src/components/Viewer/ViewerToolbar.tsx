import React from 'react';
import { Box, Button } from '@mui/material';
import { ViewerToolbarProps } from './types'; 

const ViewerToolbar: React.FC<ViewerToolbarProps> = ({ options }) => (
  <Box>
    {options.map((option, index) => option.isVisible && (
      <Button key={index} onClick={option.onClickFunc} startIcon={option.Icon}>
        {option.title}
      </Button>
    ))}
  </Box>
);

export default ViewerToolbar;