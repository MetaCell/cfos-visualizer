import Dialog from '@mui/material/Dialog';
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box, Typography } from '@mui/material';
import { ChromePicker } from 'react-color';
import vars from '../theme/variables';

const { headingColor } = vars

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
    color: 'linear-gradient(90deg, rgba(237, 27, 14, 0.40) 0%, rgba(20, 36, 186, 0.40) 48.96%, rgba(63, 186, 20, 0.40) 100%), rgba(255, 255, 255, 0.10)'
  },
  {
    name: 'Cool',
    color: 'linear-gradient(90deg, rgba(72, 154, 230, 0.4) 0%, rgba(206, 208, 75, 0.4) 100%), rgba(255, 255, 255, 0.3)'
  },
  {
    name: 'Black & White',
    color: 'linear-gradient(90deg, #030203 0%, rgba(3, 2, 3, 0.00) 100%), rgba(255, 255, 255, 0.30)'
  }

]

const Picker = ({open, onClose}) =>
{
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedColor, setSelectedColor] = React.useState('rgba(237, 27, 14, 0.40)');

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={ onClose } open={ open }>
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
            boxShadow: 'none !important'
          }
        }}>
          <ChromePicker  color={selectedColor} onChange={handleColorChange} />
        </Box>
      </CustomTabPanel>
    </Dialog>
  )
};

export default Picker;