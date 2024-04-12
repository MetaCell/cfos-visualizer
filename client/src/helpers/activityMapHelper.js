import {getLUTHelper, makeSliceTransparent, removeBackground} from "./stackHelper";
import {STACK_HELPER_BORDER_COLOR} from "../settings";

export function postProcessActivityMap(stackHelper, activityMap, orientation) {
    removeBackground(stackHelper);

    stackHelper.bbox.visible = false;
    stackHelper.border.color = STACK_HELPER_BORDER_COLOR;
    stackHelper.orientation = orientation
    stackHelper.slice.interpolation = 0 // no interpolation

    makeSliceTransparent(stackHelper);
    updateLUT(activityMap.colorRange, activityMap.intensityRange, stackHelper);

    return stackHelper
}

export function updateLUT(colorRange, intensityRange, stackHelper) {
    const helperLut = getLUTHelper(colorRange, intensityRange, [...stackHelper.stack.minMax]);
    stackHelper.slice.lut = helperLut.lut
    stackHelper.slice.lutTexture = helperLut.texture;
    stackHelper.colorRange = JSON.stringify(colorRange)
    stackHelper.intensityRange = JSON.stringify(intensityRange)
}

export function getActivityMapsDiff(activityMaps, activityMapsStackHelpersRef) {
    const newActivityMapsState = Object.keys(activityMaps);

    // Get the current activityMap IDs from the ref
    const oldActivityMapState = Object.keys(activityMapsStackHelpersRef.current);

    // Determine which activityMaps are new and need to be added
    const activityMapsToAdd = newActivityMapsState.filter(amId => !oldActivityMapState.includes(amId));

    // Determine which activityMaps are no longer in state and need to be removed
    const activityMapsToRemove = oldActivityMapState.filter(amId => !newActivityMapsState.includes(amId));

    return {activityMapsToAdd, activityMapsToRemove};
}