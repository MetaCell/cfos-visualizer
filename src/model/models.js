import Immutable from 'seamless-immutable';

export class ViewerObject {
    constructor(id, type, color, opacity, visibility) {
        return Immutable({
            id,
            type,
            color,
            opacity,
            visibility
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
