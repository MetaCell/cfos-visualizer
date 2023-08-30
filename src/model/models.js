import Immutable from 'seamless-immutable';

class ViewerObject {
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

class Experiment {
    constructor(id, details) {
        return Immutable({
            id,
            details
        });
    }
}
