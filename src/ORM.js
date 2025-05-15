const EntitySerializer = require('./EntitySerializer');
const Condition = require('./Condition');
const ORMReserved = require('./entity/ORMReserved');
const OneToMany = require('./relation/OneToMany');
const OneToOne = require('./relation/OneToOne');


/**
 * ORM.
 */
class ORM
{
    /**
     * ORM constructor.
     *
     * @param storage Storage must be localStorage or sessionStorage
     */
    constructor(storage = localStorage) {
        this._storage = storage;
        this._entity = null;
        this._object = null;
        this._serializer = new EntitySerializer();
    }

    /**
     * Use first. Say what table is use.
     *
     * @param model Needed model
     *
     * @returns {ORM}
     */
    with(model) {
        this._entity = model.table;
        this._object = model;
        this._createTableIfNotExists();

        return this;
    }

    /**
     * Get all ones.
     *
     * @param limit Result count limit
     * @param offset Results offset
     *
     * @returns {[]}
     */
    getAll(limit= 0, offset= 0) {
        this._checkIsEntityEmpty();
        const container = this._getContainer();
        let sliced = container.slice(offset, container.length);
        const serialized = [];
        for (let i = 0; i < sliced.length; i++) {
            serialized.push(this._serializer.unserialize(sliced[i]));
        }
        let result = [];
        if (limit === 0) {
            result = serialized;
        } else {
            for (let i = 0; i < limit; i++) {
                result.push(serialized[i]);
            }
        }

        return result;
    }

    /**
     * Get one.
     *
     * @param id Needed id
     *
     * @returns {*}
     */
    getOne(id) {
        this._checkIsEntityEmpty();
        const container = this.getAll();
        const result = container.find((item)=> {
           return item.id === id;
        });
        if (undefined === result) {
            throw new Error(`id ${id} not found in ${this._entity}`);
        }

        return result;
    }

    /**
     * Insert a new object.
     *
     * @returns {*}
     */
    insert() {
        this._checkIsEntityEmpty();
        const container = this._getContainer();
        this._object.entity = this._object.constructor.name;
        this._object.id = this._getCurrentIncrement(this._entity);
        container.push(this._serializer.serialize(this._object));
        this._saveState(container);
        this._incrementEntity(this._entity);

        return container.length;
    }

    /**
     * Delete one.
     */
    delete() {
        this._checkIsEntityEmpty();
        const container = this._getContainer();
        let deleted_container = container.filter((item)=>{
            const object = this._serializer.unserialize(item);

            return object.id !== this._object.id;
        });
        this._saveState(deleted_container);
    }

    /**
     * Update one.
     *
     * @returns {null}
     */
    update() {
        this._checkIsEntityEmpty();
        const container = this._getContainer();
        for (const index in container) {
            if (container.hasOwnProperty(index)) {
                let obj = this._serializer.unserialize(container[index]);
                if (obj.id === this._object.id) {
                    container[index] = this._serializer.serialize(this._object);
                }
            }
        }
        this._storage.setItem(this._entity, container);
        this._saveState(container);

        return this._object;
    }

    /**
     * Find all ones by conditions.
     *
     * @param object_conditions Conditions like {id: (id)=>{ id > 0 }}
     * @param limit Result count limit
     *
     * @returns {[]}
     */
    findAll(object_conditions, limit = 0) {
        this._checkIsEntityEmpty();
        if (!object_conditions instanceof Object) {
            throw new Error('Condition must have object type.');
        }
        const container = this._getContainer();
        let result = [];
        for (const key in container) {
            if (container.hasOwnProperty(key)) {
                const object = this._serializer.unserialize(container[key]);
                if (this._isConditions(object, object_conditions)) {
                    result.push(this._loadRelations(object));
                }
            }
        }

        if (0 === limit) {
            return result;
        } else {
            return result.slice(0, limit);
        }
    }

    _saveState(container) {
        const unnulled_container = container.filter((item)=>{
            return null !== item;
        });
        this._storage.setItem(this._entity, JSON.stringify(unnulled_container));
    }

    _checkIsEntityEmpty() {
        if (null === this._entity) {
            throw new Error('Empty entity given. Use with() method first.');
        }
    }

    _createTableIfNotExists() {
        if (undefined === this._storage.getItem('orm_reserved')) {
            this._storage.setItem('orm_reserved', JSON.stringify(new ORMReserved));
        }
        if (undefined === this._storage.getItem(this._entity)) {
            this._storage.setItem(this._entity, '[]');
            this._addToReserved(this._entity);
        }
    }

    _getContainer() {
        return JSON.parse(this._storage.getItem(this._entity));
    }

    _isConditions(object, conditions) {
        let has_conditions = true;
        for (const condition_key in conditions) {
            if (conditions.hasOwnProperty(condition_key)) {
                const condition = new Condition(condition_key, conditions[condition_key]);
                if (!condition.is(object)) {
                    has_conditions = false;
                    break;
                }
            }
        }

        return has_conditions;
    }

    _addToReserved(entity) {
        const container = this._storage.getItem('orm_reserved');
        let reserved = JSON.parse(container);
        reserved.increments[entity] = 0;
        this._storage.setItem('orm_reserved', JSON.stringify(reserved));
    }

    _incrementEntity(entity) {
        const container = this._storage.getItem('orm_reserved');
        let reserved = JSON.parse(container);
        reserved.increments[entity]++;
        this._storage.setItem('orm_reserved', JSON.stringify(reserved));
    }

    _getCurrentIncrement(entity) {
        const container = this._storage.getItem('orm_reserved');
        let reserved = JSON.parse(container);
        if (!reserved.increments.hasOwnProperty(entity)) {
            throw new Error(`Entity ${entity} not represented in increments.`);
        }

        return reserved.increments[entity];
    }

    _loadOneToMany(entity, field, value) {
        return this
            .with(entity)
            .findAll({[field]:(val)=>{
                return val === value;
            }});
    }

    _loadOneToOne(entity, field, value) {
        return this
            .with(entity)
            .findAll({[field]:(val)=>{
                    return val === value;
                }}, 1)[0];
    }

    _loadRelations(object) {
        if (0 !== object.relations.length) {
            this._inspectRelations(object);
        }

        return object;
    }

    _inspectRelations(object) {
        for (const field in object.relations) {
            this._loadRelationByType(field, object);
        }

        return this;
    }

    _loadRelationByType(field, object) {
        if (object.relations.hasOwnProperty(field)) {
            const relation = object.relations[field];
            if (relation instanceof OneToMany) {
                this._loadOneToManyRelation(relation, field, object);
            } else if (relation instanceof OneToOne) {
                this._loadOneToOneRelation(relation, field, object);
            }
        }
    }

    _loadOneToManyRelation(relation, field, object) {
        if (object.hasOwnProperty(relation.owned_field)) {
            object[field] = this._loadOneToMany(relation.related_entity, relation.related_field, object[relation.owned_field]);
        }

        return this;
    }

    _loadOneToOneRelation(relation, field, object) {
        if (object.hasOwnProperty(relation.owned_field)) {
            object[field] = this._loadOneToOne(relation.related_entity, relation.related_field, object[relation.owned_field]);
        }

        return this;
    }
}

module.exports = ORM;