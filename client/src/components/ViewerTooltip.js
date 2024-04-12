import React from 'react';
import {useSelector} from 'react-redux';
import {getAbbreviation, getName} from "../helpers/lutHelper";
import {CustomTooltip} from "./CustomTooltip";


const ViewerTooltip = ({open, anchorPosition, atlasIntensity}) => {
    const lut = useSelector(state => state.model.Lut);


    const abbreviation = getAbbreviation(lut, atlasIntensity)
    if (!open || !abbreviation) return null;

    return (
        <CustomTooltip open={open} text={abbreviation} anchorPosition={anchorPosition}/>
    );
};

export default ViewerTooltip;
