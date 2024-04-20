import {INTENSITY_NOT_FOUND_IN_LUT} from "../settings";

export function getAbbreviation(lut, atlasIntensity) {
    return lut[atlasIntensity]?.abbreviation;
}

export function getName(lut, atlasIntensity) {
    return lut[atlasIntensity]?.full_structure_name || INTENSITY_NOT_FOUND_IN_LUT;
}