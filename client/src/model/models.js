import Immutable from 'seamless-immutable';

export const Entities = {
    ATLAS: 'Atlas',
    ACTIVITY_MAP: 'ActivityMap',
    EXPERIMENT: 'experiment',
    LUT: 'LUT',
}

export class Atlas {
    constructor(id, opacity, visibility, stack, wireframeStack) {
        return Immutable({
            id,
            opacity,
            visibility,
            stack,
            wireframeStack,
        });
    }
}

export class ActivityMap {
    constructor(id, lutID, opacity, visibility, stack) {
        return Immutable({
            id,
            lutID,
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
