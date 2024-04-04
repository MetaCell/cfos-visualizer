import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const CustomTooltip = ({open, anchorPosition, dataCoordinates, value}) => {
    if (!open) return null;

    // Define styles for the tooltip
    const tooltipStyle = {
        position: 'fixed',
        top: `${anchorPosition?.y ?? 0}px`,
        left: `${anchorPosition?.x ?? 0}px`,
        transform: 'translate(20px, 0px)', // Adjust the tooltip to appear on the right
        padding: '8px',
        backgroundColor: 'rgba(97, 97, 97, 0.9)',
        color: 'white',
        borderRadius: '4px',
        zIndex: 1000, // Ensure the tooltip appears above other content
        maxWidth: '200px', // Prevent the tooltip from becoming too wide
        fontSize: '0.875rem',
        boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    };

    return (
        <Paper sx={tooltipStyle}>
            <Typography variant="caption" display="block">{`[${dataCoordinates.x}, ${dataCoordinates.y}, ${dataCoordinates.z}]`}</Typography>
            <Typography variant="caption">Value: {value}</Typography>
        </Paper>
    );
};

export default CustomTooltip;
