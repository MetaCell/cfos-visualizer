import * as THREE from "three";
import {customWidgetsVoxelprobe} from "./onHoverAmiWidget";

const VoxelProbe = customWidgetsVoxelprobe(THREE);


export const getUpdatedProbeWidget = (probeWidget, currentAtlasStackHelperRef, activityMapsStackHelpersRef, controls) => {

    if (!currentAtlasStackHelperRef.current) {
        return null
    }

    const stacks = [currentAtlasStackHelperRef.current.stack];
    Object.values(activityMapsStackHelpersRef.current).forEach(helper => stacks.push(helper.stack));

    const params = {
        stack: currentAtlasStackHelperRef.current.stack,
    };

    if (!probeWidget) {
        return new VoxelProbe(currentAtlasStackHelperRef.current.slice.mesh, controls, params)
    }

};
