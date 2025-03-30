require('entity/Entity');

export class ORMReserved extends Entity
{
    constructor() {
        super('orm_reserved');
        this.increments = {};
    }
}