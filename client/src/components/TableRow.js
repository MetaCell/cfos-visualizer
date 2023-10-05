import React, { useState } from 'react';
import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import vars from '../theme/variables';
import CustomSlider from './Slider';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import GrainIcon from '@mui/icons-material/Grain';
import { tableStyles } from './Table';
import Picker from './Picker';

const {
  headerBorderLeftColor,
  headerButtonColor
} = vars;

const colorPaletteExampleColors = [ '#3939A1', '#8A3535', '#475467' ];

const TableRow = ( { index, data, length } ) =>
{
  const [ open, setOpen ] = useState(false );
  const toggleColorPicker = () => {
    setOpen((open) => !open);
  }
  return (
    <>
      <Box sx={ tableStyles.root }>
        <Box sx={ { gap: '0.25rem !important' } }>
          <Tooltip placement='right' title="Move up/down">
            <IconButton>
              <DragIndicatorIcon />
            </IconButton>
          </Tooltip>
          <Tooltip placement='right' title={index === length - 1 ? "Not available for atlas" : "Unload image" }>
            <IconButton disabled={ index === length - 1 }>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Tooltip>

          <Divider sx={ { background: headerBorderLeftColor, width: '0.0625rem', height: '100%' } } />
          <Tooltip placement='right' title="Hide">
            <IconButton>
              <VisibilityOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip placement='right' title={ index === length - 1 ? "Not available for atlas" : "Configure color" }>
            <IconButton onClick={ toggleColorPicker } disabled={ index === length - 1 }>
              <ColorLensOutlinedIcon sx={ { color: `${ colorPaletteExampleColors[ index ] } !important` } } />
            </IconButton>
          </Tooltip>
          <Tooltip placement='right' title="Download">
            <IconButton>
              <DownloadOutlinedIcon />
            </IconButton>
          </Tooltip>



        </Box>

        <Box>
          <GrainIcon sx={ { color: headerButtonColor, fontSize: '1rem' } } />
          <Typography variant='body1'>
            { data?.name }
          </Typography>
          <Typography variant='body2' className='ellipses'>
            { data?.description }
          </Typography>
        </Box>

        <Box sx={ { gap: '0.75rem !important' } }>
          <CustomSlider defaultValue={ 10 * ( index + 1 ) } heading="Intensity" />
        </Box>
      </Box>

      { open && <Picker open={ open } onClose={ () => setOpen( false ) } /> }
    </>
  );
};

export default TableRow;