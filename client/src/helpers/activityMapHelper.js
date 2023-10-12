import {getLUTHelper, makeSliceTransparent, removeBackground} from "./stackHelper";
import {STACK_HELPER_BORDER_COLOR} from "../settings";

export function postProcessActivityMap(stackHelper, activityMap, orientation, index) {
    removeBackground(stackHelper);

    stackHelper.bbox.visible = false;
    stackHelper.border.color = STACK_HELPER_BORDER_COLOR;
    stackHelper.index = index;
    stackHelper.orientation = orientation

    makeSliceTransparent(stackHelper, activityMap.opacity);

    const helperLut = getLUTHelper(activityMap.color);
    stackHelper.slice.lut = helperLut.lut;
    stackHelper.slice.lutTexture = helperLut.texture;

    return stackHelper
}

export function getActivtyMapsDiff(activityMaps, activityMapsStackHelpersRef) {
    const newActivityMapsState = Object.keys(activityMaps);

    // Get the current activityMap IDs from the ref
    const oldActivityMapState = Object.keys(activityMapsStackHelpersRef.current);

    // Determine which activityMaps are new and need to be added
    const activityMapsToAdd = newActivityMapsState.filter(amId => !oldActivityMapState.includes(amId));

    // Determine which activityMaps are no longer in state and need to be removed
    const activityMapsToRemove = oldActivityMapState.filter(amId => !newActivityMapsState.includes(amId));

    return {activityMapsToAdd, activityMapsToRemove};
}

export const updateVisibility = (activityMapsStackHelpersRef, activeActivityMaps) => {
    Object.keys(activityMapsStackHelpersRef.current).forEach(amId => {
        const stackHelper = activityMapsStackHelpersRef.current[amId];
        stackHelper.visible = activeActivityMaps[amId]?.visibility
    });
}