import React from "react";
import vars from "../theme/variables";
import {Box, Button, Slider, Typography} from "@mui/material";

const {resetButtonColor, labelColor, resetButtonActiveColor, tooltipBgColor, whiteColor} = vars;

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

const formatValueLabel = (value) => {
    return `${Number(value).toFixed(2)}`;
};

const CustomSlider = ({
                          heading,
                          width = 1,
                          onChange,
                          value,
                          min = 0,
                          max = 100,
                          minColor = tooltipBgColor,
                          maxColor = whiteColor,
                          numberOfSteps = 100,
                          disabled = false
                      }) => {

    const step = (max - min) / numberOfSteps;

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
            <Slider
                sx={{
                    '& .MuiSlider-track': {
                        opacity: 1,
                        background: `linear-gradient(90deg, ${minColor} 0%, ${maxColor} 100%)`
                    },
                }}
                step={step}
                value={value}
                onChange={(event, newValue) => onChange(newValue)}
                min={min}
                max={max}
                valueLabelDisplay="auto"
                valueLabelFormat={formatValueLabel}
                disabled={disabled}
            />
            <Button
                disableRipple
                disabled={disabled}
                onClick={() => onChange([min, max])}
                sx={{
                    ...styles.button,
                    color: `${disabled ? resetButtonColor : resetButtonActiveColor} !important`,
                }}
            >
                Reset
            </Button>
        </Box>
    )
};

export default CustomSlider;