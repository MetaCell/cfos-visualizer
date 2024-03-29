import Immutable from 'seamless-immutable';

export const Entities = {
    ATLAS: 'Atlas',
    ACTIVITY_MAP: 'ActivityMap',
    EXPERIMENT: 'Experiment',
    LUT: 'Lut',
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
    constructor(id, colorGradient, opacityGradient, visibility, stack) {
        return {
            ...Immutable({id, colorGradient, opacityGradient, visibility}, {deep: true}),
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
