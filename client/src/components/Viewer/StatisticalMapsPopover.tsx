import React from 'react';
import { Popover, Typography, Box, Divider, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { StatisticalMapsPopoverProps } from './types';


const StatisticalMapsPopover: React.FC<StatisticalMapsPopoverProps> = ({
  id,
  open,
  anchorEl,
  onClose,
  experiments,
  onActivityMapChange,
}) => (
  <Popover
    id={id}
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  >
    <Box px={2} pt={1.25}>
      {experiments.map((experiment, index) => (
        <Box key={experiment.name}>
          {index !== 0 && <Divider sx={{ mt: 1.5, mb: 1 }} />}
          <Typography>{experiment.name}</Typography>
          <FormGroup>
            {experiment.activityMaps.map((map) => (
              <FormControlLabel
                key={map.name}
                control={
                  <Switch
                    checked={map.checked}
                    onChange={(event) => onActivityMapChange(experiment.name, map.name, event.target.checked)}
                  />
                }
                label={map.name}
              />
            ))}
          </FormGroup>
        </Box>
      ))}
    </Box>
  </Popover>
);

export default StatisticalMapsPopover;