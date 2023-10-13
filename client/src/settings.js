export const BASE_URL = process.env.REACT_APP_SERVER_URL;


export const DEFAULT_ATLAS_OPACITY = 1;
export const DEFAULT_ACTIVITY_MAP_OPACITY = 0.8;
export const DEFAULT_VISIBILITY = true;

export const VIEWER_CLEAR_COLOR = 0x00000000
export const STACK_HELPER_BORDER_COLOR = 0x353535

export const ORIENTATION = 'axial'

export const SNACKBAR_TIMEOUT = 3000

export const DEFAULT_LOADING_MESSAGE = "Loading..."

export const GRADIENTS = {
    HOT: [
        [0, 255 / 255, 9 / 255, 9 / 255],
        [1, 255 / 255, 217 / 255, 102 / 255]
    ],
    COOL: [
        [0, 20 / 255, 0 / 255, 175 / 255],
        [1, 20 / 255, 147 / 255, 255 / 255]
    ],
    BLACK_AND_WHITE: [
        [0, 3 / 255, 2 / 255, 3 / 255],
        [1, 3 / 255, 2 / 255, 0]
    ]
}

export const DEFAULT_COLOR_GRADIENT = GRADIENTS.HOT


export const LUT_DATA = {
    lut: 'custom',
    lutO: 'linear',
    opacity: [[0, 1], [1, 1]]
}
export const GRADIENT_STEPS = 9

export const STACK_MESH_INDEX = 1


export const ALLOWED_FILE_EXTENSIONS_REGEX = /\.(nii\.gz|nifti)$/
export const COMPRESSED_EXTENSION = '.msgpack'
export const WIREFRAME_IDENTIFIER = 'W'