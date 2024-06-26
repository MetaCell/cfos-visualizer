import React, {useState} from "react";
import vars from "../theme/variables";
import {Box, Button, Slider, Typography} from "@mui/material";
import {CustomToggleButton} from "./CustomToggleButton";
import CustomTextField from "./CustomTextField";

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

const formatValueLabel = (value) => `${Number(value).toFixed(2)}`;

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
                          disabled = false,
                          showPercentageAbsolute = false
                      }) => {
    const [sliderValue, setSliderValue] = useState(value);
    const [minInputValue, setMinInputValue] = useState(value[0]);
    const [maxInputValue, setMaxInputValue] = useState(value[1]);
    const [typeOfValue, setTypeOfValue] = React.useState('percentage');
    const step = (max - min) / numberOfSteps;

    const handleSliderChange = (event, newValue) => {
        if (disabled) {
            return;
        }
        if (newValue[0] >= newValue[1]) {
            setMinInputValue(sliderValue[0]);
            setMaxInputValue(sliderValue[1]);
            return;
        }

        const newMaxValue = Math.min(newValue[1], max);
        const newMinValue = Math.max(newValue[0], min);
        const newValueInRange = [newMinValue, newMaxValue]

        setSliderValue(newValueInRange);
        setMinInputValue(newMinValue);
        setMaxInputValue(newMaxValue);
        onChange(newValueInRange);
    };

    return (
        <Box width={width} display='flex' alignItems='center' gap={1.5}>
            <Typography whiteSpace='nowrap' variant='body2' sx={styles.heading}>
                {heading}
            </Typography>
            {showPercentageAbsolute && (
                <CustomToggleButton
                    typeOfValue={typeOfValue}
                    setTypeOfValue={setTypeOfValue}
                />
            )}
            <CustomTextField
                value={minInputValue}
                onChange={setMinInputValue}
                onConfirm={(value) => handleSliderChange(null, [Number(value), sliderValue[1]])}
                disabled={disabled}
                typeOfValue={typeOfValue}
                showPercentageAbsolute={showPercentageAbsolute}
            />
            <Slider
                sx={{
                    ...(disabled ? {
                        '& .MuiSlider-track': {
                            opacity: 0.5,
                            background: `linear-gradient(90deg, ${resetButtonColor} 0%, ${resetButtonColor} 100%)`
                        },
                    } : {
                        '& .MuiSlider-track': {
                            opacity: 1,
                            background: `linear-gradient(90deg, ${minColor} 0%, ${maxColor} 100%)`
                        },
                    }),
                }}
                step={step}
                value={sliderValue}
                onChange={handleSliderChange}
                min={min}
                max={max}
                valueLabelDisplay="auto"
                valueLabelFormat={formatValueLabel}
                disabled={disabled}
            />
            <CustomTextField
                value={maxInputValue}
                onChange={setMaxInputValue}
                onConfirm={(value) => handleSliderChange(null, [sliderValue[0], Number(value)])}
                disabled={disabled}
                typeOfValue={typeOfValue}
                showPercentageAbsolute={showPercentageAbsolute}
            />
            <Button
                disableRipple
                disabled={disabled}
                onClick={(e) => handleSliderChange(e, [min, max])}
                sx={{
                    ...styles.button,
                    color: `${disabled ? resetButtonColor : resetButtonActiveColor} !important`,
                }}
            >
                Reset
            </Button>
        </Box>
    );
};

export default CustomSlider;
