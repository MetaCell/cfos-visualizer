import * as React from 'react';
import PropTypes from 'prop-types';
import {Box, IconButton, Popover, Stack, Typography} from '@mui/material';
import vars from '../theme/variables';
import {useDispatch} from "react-redux";
import {changeActivityMapColor} from "../redux/actions";
import {COLOR_RANGES} from "../settings";
import {hexToNormalizedRGBA, rgbaObjectToNormalizedRgb} from "../helpers/gradientHelper";
import CustomTabs from "./CustomTabs";
import ColorPicker from "./ColorPicker";
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const {headingColor, headerBorderLeftColor, headerBorderColor} = vars

function CustomTabPanel(props) {
    const {children, value, index, sx, ...other} = props;

    return (
        <Box
            p={1}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            sx={sx}
            {...other}
        >
            {value === index && children}
        </Box>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const templateArr = [
    {
        name: 'Hot',
        color: 'linear-gradient(90deg, rgba(255, 9, 9, 0.50) 0%, rgba(255, 217, 102, 0.50) 100%), rgba(255, 255, 255, 0.10)',
        colorRange: COLOR_RANGES.HOT,
    },
    {
        name: 'Cool',
        color: 'linear-gradient(90deg, rgba(20, 0, 175, 0.80) 0%, rgba(20, 147, 255, 0.80) 100%), rgba(255, 255, 255, 0.30)',
        colorRange: COLOR_RANGES.COOL
    },
    {
        name: 'Black & White',
        color: 'linear-gradient(90deg, #030203 0%, rgba(3, 2, 3, 0.00) 100%), rgba(255, 255, 255, 0.30)',
        colorRange: COLOR_RANGES.BLACK_AND_WHITE
    }
]

const PickerWrapper = ({open, id, anchorEl, minColor, maxColor, onClose}) => {
    const dispatch = useDispatch();
    const [tab, setTab] = React.useState(0);
    const [pickerTab, setPickerTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handlePickerTabChange = (event, newValue) => {
        setPickerTab(newValue);
    };

    const handleMinColorChange = (color) => {
        dispatch(changeActivityMapColor(id, [
            rgbaObjectToNormalizedRgb(color.rgb),
            hexToNormalizedRGBA(maxColor),
        ]));
    };

    const handleMaxColorChange = (color) => {
        dispatch(changeActivityMapColor(id, [
            hexToNormalizedRGBA(minColor),
            rgbaObjectToNormalizedRgb(color.rgb)
        ]));
    };

    const handleTemplateChange = (colorRange) => {
        dispatch(changeActivityMapColor(id, colorRange));
    };

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            sx={{
                '& .MuiPopover-paper': {
                    width: '15.375rem',
                    borderRadius: '0.5rem',
                    height: '18.75rem',
                    border: `0.0625rem solid ${headerBorderLeftColor}`,
                    background: headerBorderColor,
                    boxShadow: '0rem 0.5rem 0.5rem -0.25rem rgba(16, 24, 40, 0.03), 0rem 1.25rem 1.5rem -0.25rem rgba(16, 24, 40, 0.08)',

                    '&:after': {
                        display: 'none'
                    }
                }
            }}
        >
            <CustomTabs value={tab} onChange={handleTabChange} labels={['Template', 'Custom']}/>
            <CustomTabPanel value={tab} index={0}>
                <Box display='flex' flexDirection='column' gap={1.5}>
                    {templateArr?.map((template, index) => (
                        <Box
                            sx={{
                                cursor: 'pointer',
                                borderRadius: '0.25rem',
                                background: template.color,
                                height: '4.625rem',
                                padding: '0.5rem',

                                '& .MuiTypography-root': {
                                    color: headingColor,
                                    fontSize: '0.625rem',
                                    lineHeight: '140%',
                                    fontWeight: 400
                                }
                            }}
                            key={index}
                            onClick={() => handleTemplateChange(template.colorRange)}
                        >
                            <Typography>{template.name}</Typography>
                        </Box>
                    ))}
                </Box>
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1}>
                <Stack direction='row' alignItems='center' justifyContent='space-between' width={1}>
                    <CustomTabs value={pickerTab} onChange={handlePickerTabChange} labels={['Min.', 'Max.']}
                                sx={{padding: '0 0.5rem 0.5rem 0.25rem', borderBottom: 0}}/>
                    <Tooltip title="Select the colour for min. and max. intensity">
                        <IconButton>
                            <HelpOutlineOutlinedIcon sx={{
                                '&.MuiSvgIcon-root': {
                                    color: '#5A5A5E',
                                    fontSize: '1rem'
                                }
                            }}/>
                        </IconButton>
                    </Tooltip>
                </Stack>

                <CustomTabPanel value={pickerTab} index={0} sx={{'&.MuiBox-root': {padding: 0}}}>
                    <ColorPicker selectedColor={minColor} onChange={handleMinColorChange}/>
                </CustomTabPanel>

                <CustomTabPanel value={pickerTab} index={1} sx={{'&.MuiBox-root': {padding: 0}}}>
                    <ColorPicker selectedColor={maxColor} onChange={handleMaxColorChange}/>
                </CustomTabPanel>
            </CustomTabPanel>
        </Popover>
    )
};

export default PickerWrapper;