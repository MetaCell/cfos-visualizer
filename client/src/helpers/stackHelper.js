import * as AMI from 'ami.js';
import * as THREE from 'three';
import {DIRECTIONS} from "../constants";
import {COLOR_RANGES, STACK_HELPER_BORDER_COLOR, STACK_MESH_INDEX} from "../settings";
import {getLUTGradients} from "./gradientHelper";
import { updateLUT } from './activityMapHelper';

const StackHelper = AMI.stackHelperFactory(THREE);
const HelpersLut = AMI.lutHelperFactory(THREE);

export const getNewSliceIndex = (stackHelper, direction, delta = 1) => {
    if (!stackHelper) {
        return null;
    }

    if (direction === DIRECTIONS.UP && stackHelper.index < stackHelper.orientationMaxIndex - delta) {
        return stackHelper.index + delta;
    } else if (direction === DIRECTIONS.DOWN && stackHelper.index > delta) {
        return stackHelper.index - delta;
    }

    return null;
};


export const updateStackHelperIndex = (stackHelper, newIndex) => {
    if (stackHelper) {
        stackHelper.index = newIndex;
        stackHelper.slice.interpolation = 0  // no interpolation
    }
};

export const getLUTHelper = (colorRange, intensityRange, stackIntensityRange) => {
    const dummyElement = document.createElement('div');
    const {colorGradient, opacityGradient} = getLUTGradients(colorRange, intensityRange, stackIntensityRange);
    return new HelpersLut(dummyElement, 'custom', 'custom', colorGradient, opacityGradient);
}

export const makeSliceTransparent = (stackHelper) => {
    const material = getMaterial(stackHelper)
    material.transparent = true;
}

export const getMaterial = (stackHelper) => {
    let meshIndex = 0
    if (stackHelper.children.length > STACK_MESH_INDEX) {
        meshIndex = STACK_MESH_INDEX
    }
    return stackHelper.children[meshIndex].children[0].material
}


export const removeBackground = (stackHelper) => {
    for (let i = stackHelper.children.length - 1; i >= 0; i--) {
        if (i !== STACK_MESH_INDEX) {
            const child = stackHelper.children[i];
            stackHelper.remove(child);
        }
    }
}


export function getAtlasStackHelper(stack, name, id, orientation) {
    const stackHelper = new StackHelper(stack);
    stackHelper.name = name;
    stackHelper.bbox.visible = false;
    stackHelper.border.color = STACK_HELPER_BORDER_COLOR;
    stackHelper.orientation = orientation;
    stackHelper.atlasId = id;
    stackHelper.slice.interpolation = 0 // no interpolation
    return stackHelper;
}

export function postProcessAtlas(stack, atlas) {
    stack.userData['id'] = atlas.id
    removeBackground(stack)
    makeSliceTransparent(stack)
    stack.bbox.visible = false
    updateLUT(COLOR_RANGES.GRAY, atlas.stack.minMax, stack)
}