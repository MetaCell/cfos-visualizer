import {useState} from 'react';
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
    removeActivityMapFromViewer, toggleIntensityRangeInclusion,
    toggleViewerObjectVisibility
} from "../redux/actions";
import {useDispatch} from "react-redux";
import {normalizedRgbToHex} from "../helpers/gradientHelper";
import {AtlasIcon, LockIcon, SliderIncludeIcon, UnlockIcon} from "../icons";

const {
    headerBorderLeftColor,
    headerButtonColor,
    tooltipBgColor,
    whiteColor,
    gray600
} = vars;


const TableRow = ({data, isAtlas, onDragStart, onDragEnter, onDragEnd, index}) => {
    const dispatch = useDispatch();
    const [isLocked, setIsLocked] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const {id, name, intensityRange, stackIntensityRange, isRangeInclusive, colorRange, isVisible, description} = data;
    const minColorHex = colorRange ? normalizedRgbToHex(colorRange[0]) : tooltipBgColor
    const maxColorHex = colorRange ? normalizedRgbToHex(colorRange[1]) : whiteColor
    const min = stackIntensityRange ? stackIntensityRange[0] : 0
    const max = stackIntensityRange ? stackIntensityRange[1] : 100

    const disabledHex = gray600;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onIntensityChange = (id, newValue) => {
        dispatch(changeActivityMapIntensityRange(id, newValue));
    }

    const toggleLock = () => {
        setIsLocked(!isLocked);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Box sx={tableStyles.root}
                 draggable={!isLocked}
                 onDragStart={e => onDragStart(id, index, e)}
                 onDragEnter={e => onDragEnter(id, index, e)}
                 onDragEnd={onDragEnd}>
                <Box sx={{gap: '0.25rem !important'}}>
                    <Tooltip placement='right' title={"Move up/down"}>
                        <IconButton disabled={isLocked}>
                            <DragIndicatorIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip placement='right' title={isAtlas ? "Not available for atlas" : "Unload image"}>
                        <IconButton disabled={isAtlas || isLocked} onClick={() => dispatch(removeActivityMapFromViewer(id))}>
                            <RemoveCircleOutlineIcon/>
                        </IconButton>
                    </Tooltip>

                    <Divider sx={{background: headerBorderLeftColor, width: '0.0625rem', height: '100%'}}/>
                    <Tooltip placement='right' title={"Lock"}>
                        <IconButton onClick={toggleLock}>
                            {isLocked ? <UnlockIcon/> : <LockIcon/>}
                        </IconButton>
                    </Tooltip>
                    <Tooltip placement='right' title={(isVisible || isLocked) ? "Hide" : "Show"} disabled={isLocked}>
                        <IconButton onClick={() => dispatch(toggleViewerObjectVisibility(id))}>
                            {isVisible ?
                                <VisibilityOutlinedIcon sx={{color: `${isLocked && disabledHex} !important`}}/> :
                                <VisibilityOffOutlinedIcon/>}
                        </IconButton>
                    </Tooltip>
                    <Tooltip placement='right'
                             title={isAtlas ? "Not available for atlas" :
                                 isRangeInclusive ? "Allow min value to be included as part of the intensity range" :
                                     "Exclude min value from the intensity range"}>
                        <IconButton onClick={() => dispatch(toggleIntensityRangeInclusion(id))} disabled={isAtlas || isLocked}>
                            <SliderIncludeIcon color={(isRangeInclusive || isAtlas || isLocked) && disabledHex}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip placement='right' title={isAtlas ? "Not available for atlas" : "Configure color"}>
                        <IconButton onClick={handleClick} disabled={isAtlas || isLocked}>
                            <ColorLensOutlinedIcon
                                sx={{color: `${(isAtlas || isLocked) ? disabledHex : minColorHex} !important`}}
                                disabled={isLocked}/>
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

                        isAtlas ? <AtlasIcon/> : <GrainIcon sx={{color: headerButtonColor, fontSize: '1rem'}}/>
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
                                  disabled={isLocked || isAtlas}
                                  value={intensityRange}
                                  heading="Intensity"
                                  onChange={(newValue) => onIntensityChange(id, newValue)}
                                  minColor={minColorHex}
                                  maxColor={maxColorHex}
                    />
                </Box>
            </Box>


            <PickerWrapper onClose={handleClose} id={id} open={open} anchorEl={anchorEl}
                           minColor={minColorHex}
                           maxColor={maxColorHex}/>
        </>
    );
};

export default TableRow;