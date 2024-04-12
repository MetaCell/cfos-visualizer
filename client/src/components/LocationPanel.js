import React from 'react';
import {useSelector} from "react-redux";
import {getName} from "../helpers/lutHelper";
import MapDetails from "./MapDetails";

const LocationPanel = ({open, activityMapsIntensity, dataCoordinates, atlasIntensity}) => {
    const lut = useSelector(state => state.model.Lut);
    const brainRegion = getName(lut, atlasIntensity)
    return open && (
        <MapDetails
            brainRegion={brainRegion}
            coordinates={dataCoordinates}
            maps={Object.keys(activityMapsIntensity)}
            intensityValues={Object.values(activityMapsIntensity)}
        />
    );
};

export default LocationPanel;
