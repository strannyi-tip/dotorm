export class Condition
{
    constructor(key, func, strict = false) {
        this._key = key;
        this._func = func;
    }

    is(object) {
        if (!object.hasOwnProperty(this._key)) {
            throw new Error(`Condition: Entity ${object.entity} has not field ${this._key}.`);
        }

        return this._func(object[this._key]);
    }
}