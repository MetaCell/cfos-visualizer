import * as React from 'react';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AbsoluteIcon, PercentageIcon } from "../icons";
import variables from "../theme/variables";
const { gray600, gray700, primaryActiveColor} = variables

export const CustomToggleButton = ({ typeOfValue, setTypeOfValue }) => {
    const handleChange = (event, value) => {
        if (value) {
            setTypeOfValue(value);
        }
    };

    return (
        <div>
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    border: `1px solid ${gray700}`,
                    flexWrap: 'wrap',
                    backgroundColor: 'transparent',
                    padding: '0.125rem',
                    borderRadius: '.5rem',
                }}
            >
                <ToggleButtonGroup
                    value={typeOfValue}
                    exclusive
                    onChange={handleChange}
                    aria-label="text alignment"
                    sx={{
                        '& .MuiToggleButtonGroup-grouped': {
                            border: 0,
                            borderRadius: '.5rem',
                            '&.MuiButtonBase-root': {
                                padding: '.25rem',
                            },
                            '&.Mui-selected': {
                                backgroundColor: gray600,
                                '&:hover': {
                                    backgroundColor: gray600,
                                },
                                '& svg': {
                                    '& path': {
                                        fill:primaryActiveColor
                                    }
                                }
                            }
                        },
                    }}
                >
                    <ToggleButton value={'absolute'} aria-label="Absolute">
                        <AbsoluteIcon />
                    </ToggleButton>
                    <ToggleButton value={'percentage'} aria-label="Percentage">
                        <PercentageIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Paper>
        </div>
    );
}
