import {BASE_URL} from "../settings";
import entities from "entities";

async function fetchAndDownloadFile(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();
        downloadBlob(blob, filename);
    } catch (error) {
        console.error(`Failed to download file from ${url}: ${error.message}`);
    }
}

export async function downloadActivityMap(activityMapID) {
    const stackURL = `${BASE_URL}/${entities.ACTIVITY_MAP}/${activityMapID}.NIFTI`;
    await fetchAndDownloadFile(stackURL, `${activityMapID}.NIFTI`);
}

export async function downloadAtlas(atlasID) {
    const stackURL = `${BASE_URL}/${entities.ATLAS}/${atlasID}.NIFTI`;
    const wireframeStackURL = `${BASE_URL}/${entities.ATLAS}W/${atlasID}.NIFTI`;
    await Promise.all(
        [fetchAndDownloadFile(stackURL, `${atlasID}.NIFTI`),
        fetchAndDownloadFile(wireframeStackURL, `${atlasID}W.NIFTI`)]);
}

export async function downloadAllViewerObjects(activityMapsIDs, atlasID) {
    const promises = activityMapsIDs.map(activityMapID => downloadActivityMap(activityMapID));
    promises.push(downloadAtlas(atlasID));
    await Promise.all(promises);
}