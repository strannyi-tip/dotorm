const Entity = require('./Entity');

class ORMReserved extends Entity
{
    constructor() {
        super('orm_reserved');
        this.increments = {};
    }
}

module.exports = ORMReserved;