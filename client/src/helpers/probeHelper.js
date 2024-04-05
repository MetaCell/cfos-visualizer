import * as THREE from "three";
import {customWidgetsVoxelProbe} from "./probeWidget";

const VoxelProbe = customWidgetsVoxelProbe(THREE);


export const getProbeWidget = (currentAtlasStackHelper, controls, onMouseMove) => {

    if (!currentAtlasStackHelper) {
        return null
    }

    const params = {
        stack: currentAtlasStackHelper.stack,
    };


    return new VoxelProbe(currentAtlasStackHelper.slice.mesh, controls, onMouseMove, params)

};
