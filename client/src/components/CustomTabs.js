import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const CustomTabs = ({ value, onChange, labels, sx }) => {
    return (
        <Tabs value={value} onChange={onChange} sx={sx}>
            {labels.map((label, index) => (
                <Tab key={index} disableRipple label={label} {...a11yProps(index)} />
            ))}
        </Tabs>
    );
};

export default CustomTabs;
