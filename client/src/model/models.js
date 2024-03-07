import Immutable from 'seamless-immutable';

export const Entities = {
    ATLAS: 'Atlas',
    ACTIVITY_MAP: 'ActivityMap',
    EXPERIMENT: 'Experiment',
    LUT: 'Lut',
}

export class Atlas {
    constructor(id, intensityRange, visibility, stack, wireframeStack) {
        return {
            ...Immutable({id, intensityRange, visibility}, {deep: true}),
            stack,
            wireframeStack
        };
    }
}

export class ActivityMap {
    constructor(id, colorRange, intensityRange, visibility, stack) {
        return {
            ...Immutable({id, colorRange, intensityRange, visibility}, {deep: true}),
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
