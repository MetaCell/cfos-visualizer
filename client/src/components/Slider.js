import React from "react";
import vars from "../theme/variables";
import { Box, Button, Slider, Typography } from "@mui/material";

const { resetButtonColor, labelColor, resetButtonActiveColor } = vars;

const styles = {
  heading: {
    color: labelColor,
    fontSize: '0.75rem'
  },
  button: {
    '&.MuiButton-text': {
      textTransform: 'none !important',
      padding: 0,
      fontSize: '0.75rem',
      flexShrink: 0,
      lineHeight: '150%',
      fontWeight: 400,
      minWidth: '0.0625rem'
    }
  }
};

const CustomSlider = ({ heading, width = 1, defaultValue = 30 }) => {
  const [ value, setValue ] = React.useState( defaultValue );
  const handleChange = ( event, newValue ) =>
    {
        setValue( newValue );
    };
  return (
    <Box
      width={width}
      display='flex'
      alignItems='center'
      gap={1.5}
    >
      <Typography
        whiteSpace='nowrap'
        variant='body2'
        sx={styles.heading}
      >
        {heading}
      </Typography>
      <Slider value={ value } onChange={ handleChange } />
      <Button
        disableRipple
        disabled={value === 0}
        onClick={() => setValue(0)}
        sx={{
          ...styles.button,
          color: `${value === 0 ? resetButtonColor : resetButtonActiveColor} !important`,
        }}
      >
        Reset
      </Button>
    </Box>
  )
};

export default CustomSlider;