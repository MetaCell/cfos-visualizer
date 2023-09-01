import Immutable from 'seamless-immutable';

const entities = {
    ATLAS: 'Atlas',
    ACTIVITY_MAP: 'ActivityMap',
    EXPERIMENT: 'experiment',
    LUT: 'LUT',
}

export class Atlas {
    constructor(id, color, opacity, visibility, stack, wireframeStack) {
        return Immutable({
            id,
            color,
            opacity,
            visibility,
            stack,
            wireframeStack,
        });
    }
}

export class ActivityMap {
    constructor(id, color, opacity, visibility, stack) {
        return Immutable({
            id,
            color,
            opacity,
            visibility,
            stack,
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
