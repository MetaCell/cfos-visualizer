import React from 'react';
import {useSelector} from 'react-redux';
import {getAbbreviation, getName} from "../helpers/lutHelper";
import {CustomTooltip} from "./CustomTooltip";


const ViewerTooltip = ({open, anchorPosition, atlasIntensity}) => {
    const lut = useSelector(state => state.model.Lut);


    const abbreviation = getAbbreviation(lut, atlasIntensity)
    const name = getName(lut, atlasIntensity)

    if (!open || !name) return null;

    return (
        <CustomTooltip open={open} title={abbreviation} text={name} anchorPosition={anchorPosition}/>
    );
};

export default ViewerTooltip;
