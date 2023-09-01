import Immutable from 'seamless-immutable';

export const ViewerObjectType = {
    ATLAS: 'ATLAS',
    ACTIVITY_MAP: 'ACTIVITY_MAP'
};

export class ViewerObject {
    constructor(id, type, color, opacity, visibility, stack, wireframeStack = null) {
        return Immutable({
            id,
            type,
            color,
            opacity,
            visibility,
            stack,
            wireframeStack,
        });
    }
}

export class Experiment {
    constructor(id, details) {
        return Immutable({
            id,
            details: Immutable(details)
        });
    }
}
