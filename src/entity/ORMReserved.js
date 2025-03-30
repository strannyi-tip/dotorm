require('entity/Entity');

class ORMReserved extends Entity
{
    constructor() {
        super('orm_reserved');
        this.increments = {};
    }
}