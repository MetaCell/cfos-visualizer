import React from 'react';
import {useSelector} from "react-redux";
import {getName} from "../helpers/lutHelper";

const LocationPanel = ({activityMapsIntensity, dataCoordinates, atlasIntensity}) => {
    const lut = useSelector(state => state.model.Lut);

    return (
        <div style={{
            zIndex: 10,
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: '#000',
            padding: '10px',
            boxShadow: '-2px -2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
        }}>
            <div style={{flex: 1}}>{`${getName(lut, atlasIntensity)}`}</div>
            <div style={{flex: 1}}>{`[${dataCoordinates.x}, ${dataCoordinates.y}, ${dataCoordinates.z}]`}</div>
            <div style={{flex: 1}}>
                {Object.entries(activityMapsIntensity).map(([key, intensity], index) => (
                    <div key={index}>{`${key}: ${intensity}`}; </div>
                ))}
            </div>
        </div>
    );
};

export default LocationPanel;
