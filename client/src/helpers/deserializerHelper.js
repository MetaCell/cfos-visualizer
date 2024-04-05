import * as THREE from "three";
import * as AMI from "ami.js";

const StackModel = AMI.StackModel;
const FrameModel = AMI.FrameModel;

export function deserializeStack(decodedData) {
    const stack = new StackModel();

    // Iterate over all properties of the stack
    for (let prop in stack) {
        if (stack.hasOwnProperty(prop) && decodedData.hasOwnProperty(prop)) {
            if (isVector3Object(decodedData[prop])) {
                stack[prop] = new THREE.Vector3(decodedData[prop].x, decodedData[prop].y, decodedData[prop].z);
            } else if (prop === '_frame' && Array.isArray(decodedData[prop])) {
                stack[prop] = decodedData[prop].map(frameData => deserializeFrame(frameData))
            } else {
                stack[prop] = decodedData[prop];
            }
        }
    }
    return stack;
}

function deserializeFrame(frameData) {
    const modelFrame = new FrameModel();

    // Iterate over properties from the frameData to populate the new ModelFrame object
    for (let frameProp in frameData) {
        if (frameData.hasOwnProperty(frameProp)) {
            // Directly assign all properties except for _pixelData
            if (frameProp !== '_pixelData') {
                modelFrame[frameProp] = frameData[frameProp];
            }
        }
    }
    // FIXME: _pixelRepresentation in AMI.js seems to always be set to 0 so we can't know if it's unsigned or signed
    // Handle _pixelData based on _bitsAllocated
    // Assume frameData._pixelData is initially a Uint8Array from serialization
    if (frameData._bitsAllocated === 8) {
        modelFrame._pixelData = new Int8Array(frameData._pixelData.buffer, frameData._pixelData.byteOffset, frameData._pixelData.length);
    } else if (frameData._bitsAllocated === 16) {
        modelFrame._pixelData = ensureAlignmentAndCreateTypedArray(Int16Array, frameData._pixelData);
    } else if (frameData._bitsAllocated === 32) {
        modelFrame._pixelData = ensureAlignmentAndCreateTypedArray(Uint32Array, frameData._pixelData);
    }

    return modelFrame;
}

function ensureAlignmentAndCreateTypedArray(arrayType, pixelData) {
    if (pixelData.byteOffset % arrayType.BYTES_PER_ELEMENT === 0) {
        return new arrayType(pixelData.buffer, pixelData.byteOffset, pixelData.length / arrayType.BYTES_PER_ELEMENT);
    } else {
        // If byteOffset is not aligned, copy into a new buffer that is aligned
        const alignedBuffer = new ArrayBuffer(pixelData.length);
        const uint8View = new Uint8Array(alignedBuffer);
        uint8View.set(pixelData); // Copy data into aligned buffer
        return new arrayType(alignedBuffer);
    }
}

function isVector3Object(obj) {
    return obj && typeof obj === 'object' && 'x' in obj && 'y' in obj && 'z' in obj;
}
