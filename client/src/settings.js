export const BASE_URL = process.env.REACT_APP_SERVER_URL;


export const DEFAULT_VISIBILITY = true;

export const STACK_HELPER_BORDER_COLOR = 0x353535

export const ORIENTATION = 'axial'

export const SNACKBAR_TIMEOUT = 3000

export const DEFAULT_LOADING_MESSAGE = "Loading..."

export const COLOR_RANGES = {
    HOT: [[1, 9 / 255, 9 / 255], [1, 217 / 255, 102 / 255]],
    COOL: [[20 / 255, 0 / 255, 175 / 255], [20 / 255, 147 / 255, 255 / 255]],
    BLACK_AND_WHITE: [[3 / 255, 2 / 255, 3 / 255], [3 / 255, 2 / 255, 0]]
}

export const DEFAULT_COLOR_RANGE = COLOR_RANGES.HOT

export const STACK_MESH_INDEX = 1

export const ALLOWED_FILE_EXTENSIONS_REGEX = /\.(nii\.gz|nifti)$/
export const COMPRESSED_EXTENSION = '.msgpack'
export const WIREFRAME_IDENTIFIER = 'W'

export const INTENSITY_VALUE_ERROR = "Something went wrong. Can't read intensity values"

export const INTENSITY_NOT_FOUND_IN_LUT = "Not found"
export const ABBREVIATION_NOT_FOUND_IN_LUT = "Unknown"