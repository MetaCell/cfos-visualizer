import * as AMI from "ami.js";
import {widgetsBase} from './baseAmiWidget';


const ModelsVoxel = AMI.VoxelModel
const widgetsHandleFactory = AMI.handleWidgetFactory
const CoreUtils = AMI.UtilsCore


/**
 * @module widgets/voxelProbe
 */
const customWidgetsVoxelProbe = (three = window.THREE) => {
    if (three === undefined || three.Object3D === undefined) {
        return null;
    }

    const WidgetsHandle = widgetsHandleFactory(three);


    const Constructor = widgetsBase(three);
    return class extends Constructor {
        constructor(targetMesh, controls, viewerCallback, params = {}) {
            super(targetMesh, controls, params);

            this._widgetType = 'VoxelProbe';

            // incoming parameters (optional: worldPosition)
            this._stack = params.stack; // required

            this._container.style.cursor = 'pointer';
            this._controls.enabled = false; // controls should be disabled for widgets with a single handle
            this._initialized = false; // set to true onEnd
            this._active = true;
            this._moving = true;
            this._domHovered = false;


            // handle (represent voxel)
            this._handle = new WidgetsHandle(targetMesh, controls, params);
            this.add(this._handle);
            // this._handle.hide();

            this._moveHandle = new WidgetsHandle(targetMesh, controls, params);
            this.add(this._moveHandle);
            this._moveHandle.hide();

            this.create();

            // event listeners
            this.onMove = this.onMove.bind(this);
            this.addEventListeners();

            this.viewerCallback = viewerCallback.bind(this)
        }

        addEventListeners() {
            this._container.addEventListener('mousemove', this.onMove);
        }

        removeEventListeners() {
            this._container.removeEventListener('mousemove', this.onMove);
        }

        onStart(evt) {
            this._moveHandle.onMove(evt, true);
            this._handle.onStart(evt);

            this._active = this._handle.active || this._domHovered;

            if (this._domHovered) {
                this._moving = true;
                this._controls.enabled = false;
            }

            this.update();
        }

        onMove(evt) {
            if (this._active) {
                const prevPosition = this._moveHandle.worldPosition.clone();

                this._dragged = true;
                this._moveHandle.onMove(evt, true);

                if (this._moving) {
                    this._handle.worldPosition.add(this._moveHandle.worldPosition.clone().sub(prevPosition));
                }
            }

            this._handle.onMove(evt);

            this.update();
        }

        onEnd() {
            this._handle.onEnd();

            if (!this._dragged && this._active && this._initialized) {
                this._selected = !this._selected; // change state if there was no dragging
                this._handle.selected = this._selected;
            }

            this._initialized = true;
            this._active = this._handle.active;
            this._dragged = false;
            this._moving = false;

            this.update();
        }

        hoverDom(evt) {
            this._domHovered = evt.type === 'mouseenter';
        }

        create() {
            this.createVoxel();
        }

        createVoxel() {
            this._voxel = new ModelsVoxel();
            this._voxel.id = this.id;
        }

        update() {
            this.updateColor();

            this._handle.update();
            this._worldPosition.copy(this._handle.worldPosition);

            this.updateVoxel(); // set data coordinates && value

            const info = {
                worldCoordinates: this._voxel.worldCoordinates,
                dataCoordinates: this._voxel.dataCoordinates,
                value: this._voxel.value,
                screenPosition: this._handle.screenPosition // or any other position info necessary
            };

            this.viewerCallback(info)
        }

        updateVoxel() {
            this._voxel.worldCoordinates = this._worldPosition;
            this._voxel.dataCoordinates = CoreUtils.worldToData(this._stack.lps2IJK, this._worldPosition);

            // update value
            let value = CoreUtils.getPixelData(this._stack, this._voxel.dataCoordinates);

            this._voxel.value =
                value === null || this._stack.numberOfChannels > 1
                    ? 'NA' // coordinates outside the image or RGB
                    : CoreUtils.rescaleSlopeIntercept(
                        value,
                        this._stack.rescaleSlope,
                        this._stack.rescaleIntercept
                    ).toFixed();
        }


        free() {
            this.removeEventListeners();

            this.remove(this._handle);
            this._handle.free();
            this._handle = null;
            this.remove(this._moveHandle);
            this._moveHandle.free();
            this._moveHandle = null;

            this._stack = null;
            this._voxel = null;

            super.free();
        }

        hideDOM() {
            this._handle.hideDOM();
        }

        showDOM() {
            this._handle.showDOM();
        }

        get targetMesh() {
            return this._targetMesh;
        }

        set targetMesh(targetMesh) {
            this._targetMesh = targetMesh;
            this._handle.targetMesh = targetMesh;
            this._moveHandle.targetMesh = targetMesh;
            this.update();
        }

        get worldPosition() {
            return this._worldPosition;
        }

        set worldPosition(worldPosition) {
            this._handle.worldPosition.copy(worldPosition);
            this._moveHandle.worldPosition.copy(worldPosition);
            this._worldPosition.copy(worldPosition);
            this.update();
        }

        get active() {
            return this._active;
        }

        set active(active) {
            this._active = active;
            this._controls.enabled = !this._active;

            this.update();
        }
    };
};

export {customWidgetsVoxelProbe};
export default customWidgetsVoxelProbe();
