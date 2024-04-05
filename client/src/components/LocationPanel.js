import React from 'react';
import {useSelector} from "react-redux";
import {getAbbreviation, getName} from "../helpers/lutHelper";
import MapDetails from "./MapDetails";

const LocationPanel = ({activityMapsIntensity, dataCoordinates, atlasIntensity}) => {
    const lut = useSelector(state => state.model.Lut);
    const brainRegion = getName(lut, atlasIntensity)
    return (
        <MapDetails
            brainRegion={brainRegion}
            coordinates={dataCoordinates}
            maps={Object.keys(activityMapsIntensity)}
            intensityValues={Object.values(activityMapsIntensity)}
        />
    );
};

export default LocationPanel;
