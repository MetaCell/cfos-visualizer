import {ALLOWED_FILE_EXTENSIONS_REGEX, COMPRESSED_EXTENSION, WIREFRAME_IDENTIFIER} from "./settings";

export const originalFilenameToNewExtension = (filename, newExtension = COMPRESSED_EXTENSION) => {
    return filename.replace(ALLOWED_FILE_EXTENSIONS_REGEX, newExtension);
}

export const getWireframeFilename = filename => {
    return filename.replace(ALLOWED_FILE_EXTENSIONS_REGEX, `${WIREFRAME_IDENTIFIER}.$1`);
}

export function getAdjustIntensityRange(globalRange, stackMinMax) {
    const adjustedMin = Math.max(globalRange[0], stackMinMax[0]);
    const adjustedMax = Math.min(globalRange[1], stackMinMax[1]);

    if (adjustedMin <= adjustedMax) {
        return [adjustedMin, adjustedMax];
    } else {
        if (globalRange[0] > stackMinMax[1]) {
            return [stackMinMax[1], stackMinMax[1]];
        } else if (globalRange[1] < stackMinMax[0]) {
            return [stackMinMax[0], stackMinMax[0]];
        } else {
            return [stackMinMax[0], stackMinMax[1]];
        }
    }
}
