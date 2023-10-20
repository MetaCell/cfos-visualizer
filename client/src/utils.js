import {ALLOWED_FILE_EXTENSIONS_REGEX, COMPRESSED_EXTENSION, WIREFRAME_IDENTIFIER} from "./settings";

export const originalFilenameToNewExtension = (filename, newExtension = COMPRESSED_EXTENSION) => {
    return filename.replace(ALLOWED_FILE_EXTENSIONS_REGEX, newExtension);
}

export const getWireframeFilename = filename => {
    return filename.replace(ALLOWED_FILE_EXTENSIONS_REGEX, `${WIREFRAME_IDENTIFIER}.$1`);
}