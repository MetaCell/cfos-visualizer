import {ABBREVIATION_NOT_FOUND_IN_LUT, INTENSITY_NOT_FOUND_IN_LUT} from "../settings";

export function getAbbreviation(lut, atlasIntensity) {
    let abbreviation = INTENSITY_NOT_FOUND_IN_LUT;
    if (atlasIntensity in lut) {
        abbreviation = lut[atlasIntensity].abbreviation || ABBREVIATION_NOT_FOUND_IN_LUT;
    }
    return abbreviation
}

export function getName(lut, atlasIntensity) {
    return lut[atlasIntensity]?.full_structure_name || '';
}