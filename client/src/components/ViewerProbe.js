// ProbeComponent.js
import React, {useState, useEffect, useRef} from 'react';
import ViewerTooltip from './ViewerTooltip';
import {getProbeWidget} from "../helpers/probeHelper";

const initialTooltipData = {
    open: false,
    dataCoordinates: {},
    value: '',
    anchorPosition: null,
}
export const ViewerProbe = ({refs, probeVersion}) => {
    const {stackHelperRef, controlsRef, activityMapsStackHelpersRef} = refs;


    const [tooltipData, setTooltipData] = useState({...initialTooltipData});
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

        setTooltipData({...initialTooltipData});

        return () => {
            if (probeWidgetRef.current) {
                probeWidgetRef.current.free();
                probeWidgetRef.current = null;
            }
        };
    }, [probeVersion]);


    const handleVoxelHover = ({open, dataCoordinates, value, screenPosition}) => {
        setTooltipData({
            open,
            dataCoordinates,
            value,
            anchorPosition: screenPosition,
        });
    };

    return (
        <ViewerTooltip
            open={tooltipData.open}
            anchorPosition={tooltipData.anchorPosition}
            dataCoordinates={tooltipData.dataCoordinates}
            value={tooltipData.value}
        />
    );
};
