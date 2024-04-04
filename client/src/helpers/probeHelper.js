import * as THREE from "three";
import {customWidgetsVoxelProbe} from "./probeWidget";

const VoxelProbe = customWidgetsVoxelProbe(THREE);


export const getProbeWidget = (currentAtlasStackHelper, activityMapsStackHelpers, controls, onMouseMove) => {

    if (!currentAtlasStackHelper) {
        return null
    }

    const stacks = [currentAtlasStackHelper.stack];
    Object.values(activityMapsStackHelpers).forEach(helper => stacks.push(helper.stack));

    const params = {
        stack: currentAtlasStackHelper.stack,
    };


    return new VoxelProbe(currentAtlasStackHelper.slice.mesh, controls, onMouseMove, params)

};
