import React from 'react';
import {Box, Divider, IconButton, Tooltip, Typography} from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import vars from '../theme/variables';
import CustomSlider from './Slider';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import GrainIcon from '@mui/icons-material/Grain';
import {tableStyles} from './Table';
import PickerWrapper from './PickerWrapper';
import {
    changeActivityMapIntensityRange,
    downloadViewerObject,
    removeActivityMapFromViewer,
    toggleViewerObjectVisibility
} from "../redux/actions";
import {useDispatch} from "react-redux";
import {normalizedRgbToHex} from "../helpers/gradientHelper";
import {AtlasIcon, LockIcon} from "../icons";

const {
    headerBorderLeftColor,
    headerButtonColor,
    tooltipBgColor,
    whiteColor
} = vars;


const TableRow = ({data, isAtlas}) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const {id, name, intensityRange, stackIntensityRange, colorRange, isVisible, description} = data;
    const minColorHex = colorRange ? normalizedRgbToHex(colorRange[0]) : tooltipBgColor
    const maxColorHex = colorRange ? normalizedRgbToHex(colorRange[1]) : whiteColor
    const min = stackIntensityRange ? stackIntensityRange[0] : 0
    const max = stackIntensityRange ? stackIntensityRange[1] : 100

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onIntensityChange = (id, newValue) => {
        dispatch(changeActivityMapIntensityRange(id, newValue));
    }

    const open = Boolean(anchorEl);

    return (
        <>
            <Box sx={tableStyles.root}>
                <Box sx={{gap: '0.25rem !important'}}>
                    {/*TODO: Update title when feature gets implemented*/}
                    <Tooltip placement='right' title="Move up/down (Coming Soon)">
                        <IconButton disabled>
                            <DragIndicatorIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip placement='right' title={isAtlas ? "Not available for atlas" : "Unload image"}>
                        <IconButton disabled={isAtlas} onClick={() => dispatch(removeActivityMapFromViewer(id))}>
                            <RemoveCircleOutlineIcon/>
                        </IconButton>
                    </Tooltip>

                    <Divider sx={{background: headerBorderLeftColor, width: '0.0625rem', height: '100%'}}/>
                    <Tooltip placement='right' title={"Lock"}>
                        <IconButton>
                            <LockIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip placement='right' title={isVisible ? "Hide" : "Show"}>
                        <IconButton onClick={() => dispatch(toggleViewerObjectVisibility(id))}>
                            {isVisible ? <VisibilityOutlinedIcon/> : <VisibilityOffOutlinedIcon/>}
                        </IconButton>
                    </Tooltip>
                    <Tooltip placement='right' title={isAtlas ? "Not available for atlas" : "Configure color"}>
                        <IconButton onClick={handleClick} disabled={isAtlas}>
                            <ColorLensOutlinedIcon sx={{color: `${minColorHex} !important`}}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip placement='right' title="Download">
                        <IconButton onClick={() => dispatch(downloadViewerObject(id))}>
                            <DownloadOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box>
                    {

                        isAtlas ? <AtlasIcon /> :  <GrainIcon sx={{color: headerButtonColor, fontSize: '1rem'}}/>
                    }
                    <Typography variant='body1'>
                        {name}
                    </Typography>
                    <Typography variant='body2' className='ellipses'>
                        {description}
                    </Typography>
                </Box>

                <Box sx={{gap: '0.75rem !important'}}>
                    <CustomSlider min={min}
                                  max={max}
                                  value={intensityRange}
                                  heading="Intensity"
                                  onChange={(newValue) => onIntensityChange(id, newValue)}
                                  minColor={minColorHex}
                                  maxColor={maxColorHex}
                                  disabled={isAtlas}
                    />
                </Box>
            </Box>


            <PickerWrapper onClose={handleClose} id={id} open={open} anchorEl={anchorEl} selectedColor={minColorHex}/>
        </>
    );
};

export default TableRow;