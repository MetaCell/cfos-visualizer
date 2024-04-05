import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {useSelector} from 'react-redux';
import {ABBREVIATION_NOT_FOUND_IN_LUT, INTENSITY_NOT_FOUND_IN_LUT} from "../settings";


const CustomTooltip = ({open, anchorPosition, dataCoordinates, value}) => {
    const lut = useSelector(state => state.model.Lut);

    if (!open) return null;

    let abbreviation;
    let name = ''
    if (value in lut) {
        abbreviation = lut[value].abbreviation || ABBREVIATION_NOT_FOUND_IN_LUT;
        name = lut[value].full_structure_name;
    } else {
        abbreviation = `${INTENSITY_NOT_FOUND_IN_LUT}`;
    }

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
            <Typography variant="caption" display="block">{abbreviation}</Typography>
            <Typography variant="caption">{name}</Typography>
        </Paper>
    );
};

export default CustomTooltip;
