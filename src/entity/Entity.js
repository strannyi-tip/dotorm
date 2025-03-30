export class Entity
{
    constructor(name) {
        this._table = name;
        this._relations = {};
    }

    /**
     * Table name.
     *
     * @returns {string}
     */
    get table() {
        return this._table;
    }

    /**
     * Relations list.
     *
     * @returns {{}}
     */
    get relations() {
        return this._relations;
    }
}