import * as AMI from 'ami.js';
import * as THREE from 'three';
import {DIRECTIONS} from "../constants";
import {LUT_DATA, STACK_MESH_INDEX} from "../settings";
import {getLUTGradients} from "./gradientHelper";

const StackModel = AMI.StackModel;
const HelpersLut = AMI.lutHelperFactory(THREE);

export function deserializeStack(decodedData) {
    const stack = new StackModel();

    // Iterate over all properties of the stack
    for (let prop in stack) {
        if (stack.hasOwnProperty(prop) && decodedData.hasOwnProperty(prop)) {
            if (isVector3Object(decodedData[prop])) {
                stack[prop] = new THREE.Vector3(decodedData[prop].x, decodedData[prop].y, decodedData[prop].z);
            } else {
                stack[prop] = decodedData[prop];
            }
        }
    }

    if (stack.frame && !stack.frame.getPixelData) {
        stack.frame.getPixelData = function (column, row) {
            if (column >= 0 && column < this._columns && row >= 0 && row < this._rows) {
                return this.pixelData[column + this._columns * row];
            } else {
                return null;
            }
        };
    }

    return stack;
}

function isVector3Object(obj) {
    return obj && typeof obj === 'object' && 'x' in obj && 'y' in obj && 'z' in obj;
}

export const getNewSliceIndex = (stackHelper, direction, delta = 1) => {
    if (!stackHelper) {
        return null;
    }

    if (direction === DIRECTIONS.UP && stackHelper.index < stackHelper.orientationMaxIndex - 1) {
        return stackHelper.index + delta;
    } else if (direction === DIRECTIONS.DOWN && stackHelper.index > 0) {
        return stackHelper.index - delta;
    }

    return null;
};


export const updateStackHelperIndex = (stackHelper, newIndex) => {
    if (stackHelper) {
        stackHelper.index = newIndex;
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

