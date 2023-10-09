import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box, Popover, Typography } from '@mui/material';
import { ChromePicker } from 'react-color';
import vars from '../theme/variables';

const { headingColor, whiteColor, headerBorderLeftColor, headerBorderColor } = vars

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      p={1}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const templateArr = [
  {
    name: 'Hot',
    color: 'linear-gradient(90deg, rgba(255, 9, 9, 0.50) 0%, rgba(255, 217, 102, 0.50) 100%), rgba(255, 255, 255, 0.10)'
  },
  {
    name: 'Cool',
    color: 'linear-gradient(90deg, rgba(20, 0, 175, 0.80) 0%, rgba(20, 147, 255, 0.80) 100%), rgba(255, 255, 255, 0.30)'
  },
  {
    name: 'Black & White',
    color: 'linear-gradient(90deg, #030203 0%, rgba(3, 2, 3, 0.00) 100%), rgba(255, 255, 255, 0.30)'
  }
]

const Picker = ({open, id, anchorEl, onClose}) =>
{
  const [value, setValue] = React.useState(0);
  const [ selectedColor, setSelectedColor ] = React.useState( '#4DED0E' );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
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
      } }
      sx={ {
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
      <Tabs value={ value } onChange={ handleChange }>
        {['Template', 'Custom'].map((label, index) => <Tab disableRipple label={label} {...a11yProps(index)} />)}
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <Box display='flex' flexDirection='column' gap={1.5}>
          { templateArr?.map((template, index) => (
            <Box
              sx={ {
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
              } }
              key={ index }
            >
              <Typography>{ template.name }</Typography>
            </Box>
          ))}
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Box sx={ {
          '& > div': {
            width: '100% !important',
            boxShadow: 'none !important',
            background: 'transparent !important',
            fontFamily: "'IBM Plex Sans',sans-serif !important",

            '& > div:last-of-type': {
              '& > div:first-of-type': {
                '& > div:first-of-type': {
                  '& > div': {
                    border: `0.0625rem solid ${headerBorderLeftColor}`
                  }
                }
              }
            },

            '& svg': {
              fill: `${headingColor} !important`,
              '&:hover': {
                background: `${headerBorderLeftColor} !important`,
              }
            },

            '& input': {
              backgroundColor: `${headerBorderLeftColor} !important`,
              boxShadow: 'none !important',
              color: `${headingColor} !important`,
              '&:focus': {
                boxShadow: 'none !important',
                outline: 'none !important',
              }
            }
          }
        }}>
          <ChromePicker
            color={ selectedColor }
            onChange={ handleColorChange }
          />
        </Box>
      </CustomTabPanel>
    </Popover>
  )
};

export default Picker;