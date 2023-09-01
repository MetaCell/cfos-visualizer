import {BASE_URL} from "../settings";

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


export async function downloadViewerObject(object) {
    const { id, type } = object;

    // Download stack
    const stackURL = `${BASE_URL}/${type}/${id}.NIFTI`;
    await fetchAndDownloadFile(stackURL, `${id}.NIFTI`);

    // Download wireframe stack if it exists
    if (object.wireframeStack !== null) {
        const wireframeStackURL = `${BASE_URL}/${type}/${id}W.NIFTI`;
        await fetchAndDownloadFile(wireframeStackURL, `${id}W.NIFTI`);
    }
}

export async function downloadAllViewerObjects(objects) {
    for (const object of objects) {
        await downloadViewerObject(object);
    }
}