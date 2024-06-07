import Immutable from 'seamless-immutable';

export const Entities = {
    ATLAS: 'Atlas',
    ACTIVITY_MAP: 'ActivityMap',
    EXPERIMENT: 'Experiment',
    LUT: 'Lut',
}

export class Atlas {
    constructor(id, visibility, stack, wireframeStack) {
        return {
            ...Immutable({id, visibility}, {deep: true}),
            stack,
            wireframeStack
        };
    }
}

export class ActivityMap {
    constructor(id, colorRange, intensityRange, isRangeInclusive, visibility, stack, ) {
        return {
            ...Immutable({id, colorRange, intensityRange, isRangeInclusive, visibility }, {deep: true}),
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
