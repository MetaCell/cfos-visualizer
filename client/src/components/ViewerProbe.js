import * as AMI from "ami.js";
import React, {useState, useEffect, useRef, useMemo} from 'react';
import ViewerTooltip from './ViewerTooltip';
import {getProbeWidget} from "../helpers/probeHelper";
import LocationPanel from "./LocationPanel";

const CoreUtils = AMI.UtilsCore

const initialTooltipData = {
    isIntersecting: false,
    dataCoordinates: {},
    atlasIntensity: '',
    anchorPosition: null,
}
export const ViewerProbe = ({refs, probeVersion}) => {
    const {stackHelperRef, controlsRef, activityMapsStackHelpersRef} = refs;
    const [voxelInformation, setVoxelInformation] = useState({...initialTooltipData});

    const probeWidgetRef = useRef(null);

    // Setup and cleanup the probe widget
    useEffect(() => {
        if (!stackHelperRef.current || !controlsRef.current) {
            return;
        }

        probeWidgetRef.current = getProbeWidget(
            stackHelperRef.current,
            controlsRef.current,
            handleVoxelHover,
        );

        setVoxelInformation({...initialTooltipData});

        return () => {
            if (probeWidgetRef.current) {
                probeWidgetRef.current.free();
                probeWidgetRef.current = null;
            }
        };
    }, [probeVersion]);


    const handleVoxelHover = ({isIntersecting, dataCoordinates, value, screenPosition}) => {
        setVoxelInformation({
            isIntersecting,
            dataCoordinates,
            atlasIntensity: value,
            anchorPosition: screenPosition,
        });
    };

    const activityMapsIntensity = useMemo(() => {
        if (activityMapsStackHelpersRef.current && Object.keys(voxelInformation.dataCoordinates).length) {
            return Object.entries(activityMapsStackHelpersRef.current).reduce((acc, [key, stackHelper]) => {
                if (!stackHelper.visible) {
                    return acc;
                }
                const pixelDataTmp = CoreUtils.getPixelData(stackHelper.stack, voxelInformation.dataCoordinates);
                const pixelData = CoreUtils.rescaleSlopeIntercept(pixelDataTmp, stackHelper.stack.rescaleSlope,
                    stackHelper.stack.rescaleIntercept)

                if (pixelData !== null) {
                    acc[key] = pixelData;
                }
                return acc;
            }, {});
        }
        return {};
    }, [voxelInformation.dataCoordinates, probeVersion]);


    return (
        <>
            <ViewerTooltip
                open={voxelInformation.isIntersecting}
                anchorPosition={voxelInformation.anchorPosition}
                atlasIntensity={voxelInformation.atlasIntensity}
            />
            <LocationPanel
                open={voxelInformation.isIntersecting}
                activityMapsIntensity={activityMapsIntensity}
                dataCoordinates={voxelInformation.dataCoordinates}
                atlasIntensity={voxelInformation.atlasIntensity}
            />
        </>
    )
        ;
};
