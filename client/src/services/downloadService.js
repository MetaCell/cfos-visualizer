import {BASE_URL} from "../settings";
import {Entities} from "../model/models";
import {downloadBlob} from "../helpers/downloadHelper";

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
    const stackURL = `${BASE_URL}/${Entities.ACTIVITY_MAP}/${activityMapID}.NIFTI`;
    await fetchAndDownloadFile(stackURL, `${activityMapID}.NIFTI`);
}

export async function downloadAtlas(atlasID) {
    const stackURL = `${BASE_URL}/${Entities.ATLAS}/${atlasID}.NIFTI`;
    const wireframeStackURL = `${BASE_URL}/${Entities.ATLAS}W/${atlasID}.NIFTI`;
    await Promise.all(
        [fetchAndDownloadFile(stackURL, `${atlasID}.NIFTI`),
        fetchAndDownloadFile(wireframeStackURL, `${atlasID}W.NIFTI`)]);
}

export async function downloadAllViewerObjects(activityMapsIDs, atlasID) {
    const promises = activityMapsIDs.map(activityMapID => downloadActivityMap(activityMapID));
    promises.push(downloadAtlas(atlasID));
    await Promise.all(promises);
}