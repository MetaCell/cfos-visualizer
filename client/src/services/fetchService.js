import {decode} from '@msgpack/msgpack';
import {BASE_URL, COMPRESSED_EXTENSION, WIREFRAME_IDENTIFIER} from "../settings";
import {deserializeStack} from "../helpers/stackHelper";
import {Entities} from "../model/models";
import {originalFilenameToNewExtension} from "../utils";


export async function fetchModelStructure() {
    try {
        const response = await fetch(`${BASE_URL}/index.json?metacell=1`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch model structure: ${error.message}`);
        throw error;
    }
}

export async function fetchExperimentMetadata(experimentID) {
    try {
        const response = await fetch(`${BASE_URL}/${Entities.EXPERIMENT}/${experimentID}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch experiment metadata: ${error.message}`);
        throw error;
    }
}

export async function fetchAtlasStack(filename) {
    try {
        const response = await fetch(`${BASE_URL}/${Entities.ATLAS}/${originalFilenameToNewExtension(filename)}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const buffer = await response.arrayBuffer();
        return deserializeStack(decode(buffer));
    } catch (error) {
        console.error(`Failed to fetch and decode atlas data: ${error.message}`);
        throw error;
    }
}

export async function fetchAtlasWireframeStack(filename) {
    try {
        const wireframeFilename = originalFilenameToNewExtension(`${filename}`, `${WIREFRAME_IDENTIFIER}${COMPRESSED_EXTENSION}`)
        const response = await fetch(`${BASE_URL}/${Entities.ATLAS}/${wireframeFilename}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const buffer = await response.arrayBuffer();
        return deserializeStack(decode(buffer));
    } catch (error) {
        console.error(`Failed to fetch and decode atlas wireframe data: ${error.message}`);
        throw error;
    }
}

export async function fetchActivityMapStack(filename) {
    try {
        const response = await fetch(`${BASE_URL}/${Entities.ACTIVITY_MAP}/${originalFilenameToNewExtension(filename)}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const buffer = await response.arrayBuffer();
        return deserializeStack(decode(buffer));
    } catch (error) {
        console.error(`Failed to fetch and decode activity map data: ${error.message}`);
        throw error;
    }
}

export async function fetchLUTFile(lutID) {
    try {
        const response = await fetch(`${BASE_URL}/${Entities.LUT}/${lutID}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch LUT file: ${error.message}`);
        throw error;
    }
}
