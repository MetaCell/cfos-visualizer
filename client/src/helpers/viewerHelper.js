import * as THREE from "three";
import * as AMI from 'ami.js';

import {ORIENTATION} from "../settings";
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
    container.appendChild(renderer.domElement);
    return renderer;
}

export const initScene = () => new THREE.Scene();

export const getOrthographicCamera = (container) => {
    const camera = new OrthographicCamera(
        container.clientWidth / -2,
        container.clientWidth / 2,
        container.clientHeight / 2,
        container.clientHeight / -2,
        1,
        1000
    );
    camera.fov = 50;
    camera.aspect = 1;
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
