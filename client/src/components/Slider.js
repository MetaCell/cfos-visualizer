import React from "react";
import vars from "../theme/variables";
import {Box, Button, Slider, Typography} from "@mui/material";
import {useDispatch} from "react-redux";
import {changeActivityMapColor, changeViewerObjectOpacity} from "../redux/actions";
import {getColorGradient, getOpacityGradient} from "../helpers/gradientHelper";

const {resetButtonColor, labelColor, resetButtonActiveColor} = vars;

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

const CustomSlider = ({heading, width = 1, onChange, value}) => {
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
            <Slider value={value} onChange={(event, newValue) => onChange(newValue)}/>
            <Button
                disableRipple
                disabled={value === 0}
                onClick={() => onChange(0)}
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