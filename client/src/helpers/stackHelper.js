import * as AMI from 'ami.js';
import * as THREE from 'three';
import {DIRECTIONS} from "../constants";
import {LUT_DATA, STACK_MESH_INDEX} from "../settings";

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

    return stack;
}

function isVector3Object(obj) {
    return obj && typeof obj === 'object' && 'x' in obj && 'y' in obj && 'z' in obj;
}

export const updateSlice = (stackHelper, direction) => {
    if (stackHelper) {
        if (direction === DIRECTIONS.UP) {
            if (stackHelper.index >= stackHelper.orientationMaxIndex - 1) {
                return
            }
            stackHelper.index = stackHelper.index + 1;
        } else {
            if (stackHelper.index <= 0) {
                return
            }
            stackHelper.index = stackHelper.index - 1;
        }
    }
}


export const getLUTHelper = (color) => {
    const dummyElement = document.createElement('div');
    const helpLut = new HelpersLut(dummyElement);
    helpLut.luts = HelpersLut.presetLuts();
    helpLut.lut = LUT_DATA.lut;
    helpLut.lut0 = LUT_DATA.lut0;
    helpLut.color = color;
    helpLut.opacity = LUT_DATA.opacity;
    return helpLut
}


export const makeSliceTransparent = (stackHelper, opacity) => {
    let material = stackHelper.children[0].children[0].material
    material.transparent = true;
    material.uniforms.uOpacity.value = opacity
    material.needsUpdate = true;
}


export const removeBackground = (stackHelper) => {
    for (let i = stackHelper.children.length - 1; i >= 0; i--) {
        if (i !== STACK_MESH_INDEX) {
            const child = stackHelper.children[i];
            stackHelper.remove(child);
        }
    }
}
