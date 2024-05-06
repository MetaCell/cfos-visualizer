import {DEFAULT_COLOR_RANGE} from "../settings";

export function getLUTGradients(colorRange, intensityRange, isRangeInclusive, stackIntensityRange) {

    // Adjust intensityRange if it's outside stackIntensityRange
    if (intensityRange[0] < stackIntensityRange[0] || intensityRange[1] > stackIntensityRange[1]) {
        console.error('IntensityRange is outside StackIntensityRange. Using StackIntensityRange instead.');
        intensityRange = [...stackIntensityRange];
    }

    // Normalize the intensity range
    const epsilon = isRangeInclusive ? 0 : 0.01; // A small value to ensure min is non-inclusive
    const normalizedMinIntensity = Math.min((intensityRange[0] - stackIntensityRange[0]) / (stackIntensityRange[1] - stackIntensityRange[0]) + epsilon, 1);
    const normalizedMaxIntensity = (intensityRange[1] - stackIntensityRange[0]) / (stackIntensityRange[1] - stackIntensityRange[0]);

    let colorGradient, opacityGradient;

    if (normalizedMinIntensity === 0 && normalizedMaxIntensity === 1) {
        // Simplify gradients when intensityRange matches stackIntensityRange
        colorGradient = [
            [0.0, ...colorRange[0], 1], // Min color at start of intensity range
            [1.0, ...colorRange[1], 1] // Max color at end of intensity range
        ];
        opacityGradient = [
            [0.0, 1], // Fully opaque across the range
            [1.0, 1] // Maintain opacity
        ];
    } else {
        // Define gradients with transitions
        colorGradient = [
            [0.0, 0, 0, 0, 0], // Transparent below intensity range
            [normalizedMinIntensity - epsilon, 0, 0, 0, 0], // Transparent below intensity range
            [normalizedMinIntensity, ...colorRange[0], 1], // Min color at start of intensity range
            [normalizedMaxIntensity, ...colorRange[1], 1], // Max color at end of intensity range
            [1.0, ...colorRange[1], 1] // Max should take everything above the max set.
        ];
        opacityGradient = [
            [0.0, 0], // Fully transparent below intensity range
            [normalizedMinIntensity - epsilon, 0], // Fully transparent below intensity range
            [normalizedMinIntensity, 1], // Opaque within intensity range
            [normalizedMaxIntensity, 1], // Opaque within intensity range
            [1.0, 1] // Max should take everything above the max set.
        ];
    }

    return {colorGradient, opacityGradient};
}


export function normalizedRgbToHex(rgbArray) {
    // Ensure the input is an array of three normalized values
    if (!Array.isArray(rgbArray) || rgbArray.length !== 3) {
        throw new Error("Input must be an array of three normalized RGB values");
    }

    // Convert each normalized float to an integer and then to a hex string
    const hex = rgbArray.map(normalizedValue => {
        // Ensure the value is within the expected range
        if (normalizedValue < 0 || normalizedValue > 1) {
            throw new Error("Each value in the array must be between 0 and 1");
        }

        // Convert to an integer in the range 0-255
        const intValue = Math.round(normalizedValue * 255);
        // Convert the integer to a hex string and pad with leading zero if necessary
        return intValue.toString(16).padStart(2, '0');
    }).join('');

    return `#${hex}`;
}

function isValidHex(hex) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex) || /^#([0-9A-F]{4}){2}$/i.test(hex);
}

function isValidRgba(rgba) {
    return typeof rgba === 'object' &&
        rgba !== null &&
        'r' in rgba && rgba.r >= 0 && rgba.r <= 255 &&
        'g' in rgba && rgba.g >= 0 && rgba.g <= 255 &&
        'b' in rgba && rgba.b >= 0 && rgba.b <= 255 &&
        'a' in rgba && rgba.a >= 0 && rgba.a <= 1;
}

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return [r, g, b];
}

export function rgbaObjectToNormalizedRgb(rgba) {
    return [rgba.r / 255, rgba.g / 255, rgba.b / 255];
}

export function hexToNormalizedRGBA(hex) {
    const [r, g, b] = hexToRgb(hex)
    return rgbaObjectToNormalizedRgb({r, g, b})
}