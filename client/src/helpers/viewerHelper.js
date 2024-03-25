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
    renderer.sortObjects = false // FIXME: Workaround for the atlas always be on top
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


            cameraRef.current.left = width / -2;
            cameraRef.current.right = width / 2;
            cameraRef.current.top = height / 2;
            cameraRef.current.bottom = height / -2;
            cameraRef.current.updateProjectionMatrix();

            rendererRef.current.setSize(width, height);
        }, 0);
    }
};

export const filterExperimentsByInnerExperiment = (atlas, experimentName) => {
    // Find the inner experiments for the given experiment name
    const targetExperiment = atlas.ExperimentsAtlas.find(experiment => experiment.name === experimentName);
    if (!targetExperiment) return [];
  
    const innerExperiments = targetExperiment.inner_experiments;
  
    // Filter experiments sharing the same inner experiments, excluding the target experiment itself
    return atlas.ExperimentsAtlas.filter(experiment => 
      experiment.name !== experimentName && 
      experiment.inner_experiments.some(inner => innerExperiments.includes(inner))
    ).map(experiment => experiment.name);
  }