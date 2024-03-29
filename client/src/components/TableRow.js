import React from 'react';
import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import vars from '../theme/variables';
import CustomSlider from './Slider';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import GrainIcon from '@mui/icons-material/Grain';
import { tableStyles } from './Table';
import Picker from './Picker';
import {
  changeViewerObjectOpacity,
  downloadViewerObject,
  removeActivityMapFromViewer,
  toggleViewerObjectVisibility
} from "../redux/actions";
import {useDispatch} from "react-redux";
import {getOriginalHexColor} from "../helpers/gradientHelper";

const {
  headerBorderLeftColor,
  headerButtonColor
} = vars;


const TableRow = ( { index, data, isAtlas } ) =>
{
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { id, name, color, opacity, isVisible, description } = data;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onOpacityChange = (id, newValue) => {
    dispatch(changeViewerObjectOpacity(id, newValue));
  }

  const open = Boolean(anchorEl);

  return (
    <>
      <Box sx={ tableStyles.root }>
        <Box sx={ { gap: '0.25rem !important' } }>
          {/*TODO: Update title when feature gets implemented*/}
          <Tooltip placement='right' title="Move up/down (Coming Soon)">
            <IconButton disabled>
              <DragIndicatorIcon />
            </IconButton>
          </Tooltip>
          <Tooltip placement='right' title={isAtlas ? "Not available for atlas" : "Unload image" }>
            <IconButton disabled={ isAtlas} onClick={() => dispatch(removeActivityMapFromViewer(id))}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Tooltip>

          <Divider sx={ { background: headerBorderLeftColor, width: '0.0625rem', height: '100%' } } />
          <Tooltip placement='right' title={isVisible ? "Hide" : "Show"}>
            <IconButton onClick={() => dispatch(toggleViewerObjectVisibility(id))}>
              { isVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip placement='right' title={ isAtlas ? "Not available for atlas" : "Configure color" }>
            <IconButton onClick={handleClick} disabled={ isAtlas }>
              <ColorLensOutlinedIcon sx={ { color: `${ color } !important` } } />
            </IconButton>
          </Tooltip>
          <Tooltip placement='right' title="Download">
            <IconButton onClick={() => dispatch(downloadViewerObject(id))}>
              <DownloadOutlinedIcon />
            </IconButton>
          </Tooltip>



        </Box>

        <Box>
          <GrainIcon sx={ { color: headerButtonColor, fontSize: '1rem' } } />
          <Typography variant='body1'>
            { name }
          </Typography>
          <Typography variant='body2' className='ellipses'>
            { description }
          </Typography>
        </Box>

        <Box sx={ { gap: '0.75rem !important' } }>
          <CustomSlider value={ 100 * opacity } heading="Intensity" onChange={(newValue) => onOpacityChange(id, newValue)}/>
        </Box>
      </Box>


      <Picker onClose={handleClose} id={id} open={open} anchorEl={anchorEl} selectedColor={color} />
    </>
  );
};

export default TableRow;