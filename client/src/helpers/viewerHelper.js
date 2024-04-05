import * as THREE from "three";
import * as AMI from 'ami.js';

import {CAMERA_RANGE, ORIENTATION} from "../settings";
import {sceneObjects} from "../redux/constants";

const TrackballOrthoControl = AMI.trackballOrthoControlFactory(THREE);
const OrthographicCamera = AMI.orthographicCameraFactory(THREE);

export const initRenderer = (viewerContainerRef) => {
    const container = viewerContainerRef.current;
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.sortObjects = false // FIXME: Workaround for the atlas always be on top
    container.appendChild(renderer.domElement);
    return renderer;
}

export const initScene = () => new THREE.Scene();

export const getOrthographicCamera = (container) => {
    const camera = new OrthographicCamera(
        container.clientWidth / -CAMERA_RANGE,
        container.clientWidth / CAMERA_RANGE,
        container.clientHeight / CAMERA_RANGE,
        container.clientHeight / -CAMERA_RANGE,
        1,
        1000
    );
    camera.name = sceneObjects.CAMERA
    return camera;
}

export const getControls = (camera, baseContainer) => {
    const controls = new TrackballOrthoControl(camera, baseContainer);
    controls.staticMoving = true;
    controls.noRotate = true;
    return controls;
}

export const updateCamera = (container, camera, stack) => {
    // center camera and interactor to center of bounding box
    const centerLPS = stack.worldCenter()
    camera.lookAt(centerLPS.x, centerLPS.y, centerLPS.z);
    camera.updateProjectionMatrix();

    const worldBB = stack.worldBoundingBox();
    const lpsDims = new THREE.Vector3(
        (worldBB[1] - worldBB[0]) / 2,
        (worldBB[3] - worldBB[2]) / 2,
        (worldBB[5] - worldBB[4]) / 2
    );
    const box = {
        center: stack.worldCenter().clone(),
        halfDimensions: new THREE.Vector3(lpsDims.x + 5, lpsDims.y + 5, lpsDims.z + 5),
    };

    camera = updateCameraDimensions(camera, container);

    camera.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
    camera.box = box;
    camera.orientation = ORIENTATION;
    camera.update();
    camera.fitBox(2, 1);
}

const updateCameraDimensions = (camera, container) => {
    camera.canvas = {
        width: container.clientWidth,
        height: container.clientHeight,
    };
    return camera
}

export const resize = (containerRef, rendererRef, cameraRef) => {
    if (containerRef.current && rendererRef.current && cameraRef.current) {
        // Delay the resize operation slightly to ensure new dimensions are used
        setTimeout(() => {
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;


            cameraRef.current.left = width / -CAMERA_RANGE;
            cameraRef.current.right = width / CAMERA_RANGE;
            cameraRef.current.top = height / CAMERA_RANGE;
            cameraRef.current.bottom = height / -CAMERA_RANGE;
            cameraRef.current.updateProjectionMatrix();

            rendererRef.current.setSize(width, height);
        }, 0);
    }
};