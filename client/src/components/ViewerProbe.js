// ProbeComponent.js
import React, {useState, useEffect, useRef} from 'react';
import ViewerTooltip from './ViewerTooltip';
import {getProbeWidget} from "../helpers/probeHelper";

export const ViewerProbe = ({refs, probeVersion}) => {
    const {stackHelperRef, controlsRef, activityMapsStackHelpersRef} = refs;

    const [tooltipData, setTooltipData] = useState({
        open: false,
        worldCoordinates: {},
        dataCoordinates: {},
        value: '',
        anchorPosition: null,
    });
    const probeWidgetRef = useRef(null);

    // Setup and cleanup the probe widget
    useEffect(() => {
        if (!stackHelperRef.current || !controlsRef.current) {
            return;
        }

        probeWidgetRef.current = getProbeWidget(
            stackHelperRef.current,
            activityMapsStackHelpersRef.current,
            controlsRef.current,
            handleVoxelHover,
        );

        return () => {
            if (probeWidgetRef.current) {
                probeWidgetRef.current.free();
                probeWidgetRef.current = null;
            }
        };
    }, [probeVersion]);


    const handleVoxelHover = ({worldCoordinates, dataCoordinates, value, screenPosition}) => {
        setTooltipData({
            open: true,
            worldCoordinates,
            dataCoordinates,
            value,
            anchorPosition: screenPosition,
        });
    };

    return (
        <ViewerTooltip
            open={tooltipData.open}
            anchorPosition={tooltipData.anchorPosition}
            worldCoordinates={tooltipData.worldCoordinates}
            dataCoordinates={tooltipData.dataCoordinates}
            value={tooltipData.value}
        />
    );
};
