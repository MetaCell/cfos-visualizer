import * as AMI from 'ami.js';
import * as THREE from 'three';

const StackModel = AMI.StackModel;

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