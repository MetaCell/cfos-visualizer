import { decode } from '@msgpack/msgpack';
import {BASE_URL} from "../settings";
import {deserializeStack} from "../helpers/stackHelper";


export async function fetchModelStructure() {
    try {
        const response = await fetch(`${BASE_URL}/index.jsom`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch model structure: ${error.message}`);
        throw error;
    }
}

export async function fetchExperimentMetadata(experimentID) {
    try {
        const response = await fetch(`${BASE_URL}/Experiment/${experimentID}.json`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch experiment metadata: ${error.message}`);
        throw error;
    }
}

export async function fetchAtlasStack(atlasID) {
    try {
        const response = await fetch(`${BASE_URL}/Atlas/${atlasID}.msgpack`);
        if (!response.ok) throw new Error('Network response was not ok');

        const buffer = await response.arrayBuffer();
        return deserializeStack(decode(buffer));
    } catch (error) {
        console.error(`Failed to fetch and decode atlas data: ${error.message}`);
        throw error;
    }
}

export async function fetchAtlasWireframeStack(atlasID) {
    try {
        const response = await fetch(`${BASE_URL}/Atlas/${atlasID}W.msgpack`);
        if (!response.ok) throw new Error('Network response was not ok');

        const buffer = await response.arrayBuffer();
        return deserializeStack(decode(buffer));
    } catch (error) {
        console.error(`Failed to fetch and decode atlas wireframe data: ${error.message}`);
        throw error;
    }
}

export async function fetchActivityMapStack(activityMapID) {
    try {
        const response = await fetch(`${BASE_URL}/ActivityMap/${activityMapID}.msgpack`);
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
        const response = await fetch(`${BASE_URL}/LUT/${lutID}.json`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch LUT file: ${error.message}`);
        throw error;
    }
}
