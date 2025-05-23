const Relation = require('../Relation');

class OneToOne extends Relation
{
    constructor(related_entity, related_field, owned_field) {
        super();
        this.related_entity = related_entity;
        this.related_field = related_field;
        this.owned_field = owned_field;
    }
}

module.exports = OneToOne;