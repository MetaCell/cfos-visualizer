import {DEFAULT_COLOR_GRADIENT} from "../settings";


export function getOriginalHexColor(gradient) {
    // Find the color associated with color stop 0
    const originalColor = gradient.find(color => color[0] === 0);
    if (!originalColor) {
        console.warn("Color stop 0 not found in gradient");
        return null;
    }

    const r = Math.round(originalColor[1] * 255);
    const g = Math.round(originalColor[2] * 255);
    const b = Math.round(originalColor[3] * 255);

    return rgbToHex(r, g, b);
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}


export function getColorGradient(hex) {
    const originalColor = hexToRgb(hex);

    if(!originalColor){
        console.warn(`Invalid hex color provided: ${hex}`)
        return DEFAULT_COLOR_GRADIENT
    }

    const complementaryColor = getComplementaryColor(originalColor);

    return [
        [0, originalColor.r, originalColor.g, originalColor.b],
        [1, complementaryColor.r, complementaryColor.g, complementaryColor.b]
    ];
}

export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : null;
}

export function getComplementaryColor(color) {
    return {
        r: 1 - color.r,
        g: 1 - color.g,
        b: 1 - color.b
    };
}