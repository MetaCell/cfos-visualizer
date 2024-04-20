import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import variables from "../theme/variables";
const {gray200, gray700, gray400, gray600} = variables

const CustomTextField = ({ defaultValue, disabled, typeOfValue, showPercentageAbsolute }) => {
    return (
        <TextField
            value={defaultValue}
            InputProps={{
                endAdornment:  typeOfValue === 'percentage' && showPercentageAbsolute && (
                    <InputAdornment position="start">%</InputAdornment>
                ),
            }}
            sx={{
                '& .MuiInputBase-root': {
                    backgroundColor: gray700,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    '& .MuiTypography-root': {
                        color: gray200,
                        fontSize: '0.875rem'
                    },
                    '&.Mui-disabled': {
                        backgroundColor: 'transparent',
                        '& .MuiTypography-root': {
                            color: gray400,
                        },
                        '& .MuiInputBase-input': {
                            '-webkit-text-fill-color': gray400,
                        },
                        '& fieldset': {
                            borderColor: 'transparent'
                        },
                        '&:hover, &.Mui-focused': {
                            '& fieldset': {
                                borderColor: 'transparent',
                            }
                        },
                    },
                    '& .MuiInputAdornment-root': {
                        margin: 0
                    },
                    '& .MuiOutlinedInput-root': {
                        padding: '0'
                    },
                    '& .MuiInputBase-input': {
                        padding: '0',
                        color: gray200,
                        fontSize: '0.875rem',
                    },
                    '& fieldset': {
                        borderColor: gray700
                    },
                    '&:hover, &.Mui-focused': {
                        '& fieldset': {
                            border: `1px solid ${gray600}`,
                        }
                    },
                }
            }}
            disabled={disabled}
        />
    );
};

export default CustomTextField;
