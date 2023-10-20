import {BASE_URL} from "../settings";
import {Entities} from "../model/models";
import {downloadBlob} from "../helpers/downloadHelper";
import {getWireframeFilename} from "../utils";

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

export async function downloadActivityMap(filename) {
    const stackURL = `${BASE_URL}/${Entities.ACTIVITY_MAP}/${filename}`;
    await fetchAndDownloadFile(stackURL, `${filename}`);
}

export async function downloadAtlas(filename) {
    const stackURL = `${BASE_URL}/${Entities.ATLAS}/${filename}`;
    const wireframeFilename = getWireframeFilename(filename)
    const wireframeStackURL = `${BASE_URL}/${Entities.ATLAS}/${wireframeFilename}`;
    await Promise.all(
        [fetchAndDownloadFile(stackURL, `${filename}`),
            fetchAndDownloadFile(wireframeStackURL, `${wireframeFilename}`)]);
}

export async function downloadAllViewerObjects(activityMapsIDs, atlasID) {
    const promises = activityMapsIDs.map(activityMapID => downloadActivityMap(activityMapID));
    promises.push(downloadAtlas(atlasID));
    await Promise.all(promises);
}