import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {useSelector} from 'react-redux';
import {getAbbreviation, getName} from "../helpers/lutHelper";
import {CustomTooltip} from "./CustomTooltip";


const ViewerTooltip = ({open, anchorPosition, atlasIntensity}) => {
    const lut = useSelector(state => state.model.Lut);

    if (!open) return null;

    const abbreviation = getAbbreviation(lut, atlasIntensity)
    const name = getName(lut, atlasIntensity)



    return (
        <CustomTooltip open={open} title={abbreviation} text={name}/>
    );
};

export default ViewerTooltip;
