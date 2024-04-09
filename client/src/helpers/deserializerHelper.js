import * as THREE from "three";
import * as AMI from "ami.js";

const StackModel = AMI.StackModel;
const FrameModel = AMI.FrameModel;

export function deserializeStack(decodedData) {
    if (!decodedData || !decodedData.stack) {
        throw new Error('Invalid decoded data format.');
    }

    const stackData = decodedData.stack;
    const dataType = decodedData.dataType;
    const stack = new StackModel();

    // Iterate over all properties of the stack
    for (let prop in stack) {
        if (stack.hasOwnProperty(prop) && stackData.hasOwnProperty(prop)) {
            if (isVector3Object(stackData[prop])) {
                stack[prop] = new THREE.Vector3(stackData[prop].x, stackData[prop].y, stackData[prop].z);
            } else if (prop === '_frame' && Array.isArray(stackData[prop])) {
                stack[prop] = stackData[prop].map(frameData => deserializeFrame(frameData, dataType))
            } else {
                stack[prop] = stackData[prop];
            }
        }
    }
    return stack;
}

function deserializeFrame(frameData, dataType) {
    const modelFrame = new FrameModel();

    const typedArrayConstructor = getTypedArrayConstructor(dataType);

    if (!typedArrayConstructor) {
        throw new Error(`Unsupported dataType: ${dataType}`);
    }

    for (let frameProp in frameData) {
        if (frameData.hasOwnProperty(frameProp)) {
            if (frameProp === '_pixelData' && typedArrayConstructor) {
                // Handle _pixelData with dynamic typed array based on dataType
                modelFrame[frameProp] = ensureAlignmentAndCreateTypedArray(typedArrayConstructor, frameData._pixelData);
            } else {
                modelFrame[frameProp] = frameData[frameProp];
            }
        }
    }

    return modelFrame;
}

function ensureAlignmentAndCreateTypedArray(arrayType, pixelData) {
    // Ensure the byte offset is aligned with the typed array's element size
    if (pixelData.byteOffset % arrayType.BYTES_PER_ELEMENT === 0) {
        return new arrayType(pixelData.buffer, pixelData.byteOffset, pixelData.length / arrayType.BYTES_PER_ELEMENT);
    } else {
        // If the byteOffset is not aligned, copy into a new buffer
        const alignedBuffer = new ArrayBuffer(pixelData.length);
        const uint8View = new Uint8Array(alignedBuffer);
        uint8View.set(new Uint8Array(pixelData.buffer, pixelData.byteOffset, pixelData.length));
        return new arrayType(alignedBuffer);
    }
}

function getTypedArrayConstructor(dataType) {
    // Mapping of data type strings to typed array constructors
    const typedArrayMap = {
        'Int8Array': Int8Array,
        'Uint8Array': Uint8Array,
        'Int16Array': Int16Array,
        'Uint16Array': Uint16Array,
        'Int32Array': Int32Array,
        'Uint32Array': Uint32Array,
        'Float32Array': Float32Array,
        'Float64Array': Float64Array
    };

    return typedArrayMap[dataType] || null;
}


function isVector3Object(obj) {
    return obj && typeof obj === 'object' && 'x' in obj && 'y' in obj && 'z' in obj;
}
