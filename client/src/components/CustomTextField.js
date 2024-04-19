import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

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
                    backgroundColor: '#1E1E1F',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    '& .MuiTypography-root': {
                        color: '#B1B1B4',
                        fontSize: '0.875rem'
                    },
                    '&.Mui-disabled': {
                        backgroundColor: 'transparent',
                        '& .MuiTypography-root': {
                            color: '#737378',
                        },
                        '& .MuiInputBase-input': {
                            '-webkit-text-fill-color': '#737378',
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
                        color: '#B1B1B4',
                        fontSize: '0.875rem',
                    },
                    '& fieldset': {
                        borderColor: '#1E1E1F'
                    },
                    '&:hover, &.Mui-focused': {
                        '& fieldset': {
                            border: '1px solid #302F31',
                        }
                    },
                }
            }}
            disabled={disabled}
        />
    );
};

export default CustomTextField;
