import Immutable from 'seamless-immutable';

export const Entities = {
    ATLAS: 'atlas',
    ACTIVITY_MAP: 'activityMap',
    EXPERIMENT: 'experiment',
    LUT: 'lut',
}

export class Atlas {
    constructor(id, opacity, visibility, stack, wireframeStack) {
        return {
            ...Immutable({id, opacity, visibility}, {deep: true}),
            stack,
            wireframeStack
        };
    }
}

export class ActivityMap {
    constructor(id, color, opacity, visibility, stack) {
        return {
            ...Immutable({id, color, opacity, visibility}, {deep: true}),
            stack,
        };
    }
}

export class Experiment {
    constructor(id, details) {
        return Immutable({
            id,
            details
        });
    }
}
