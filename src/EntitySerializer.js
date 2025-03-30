/**
 * Entity serializer.
 */
class EntitySerializer
{
    /**
     * Serialize entity.
     *
     * @param object Entity object
     *
     * @returns {string}
     */
    serialize(object) {
        this._recursiveSerializeObject(object);

        return JSON.stringify(object);
    }

    /**
     * Unserialize string to object.
     *
     * @param string JSON entity object
     *
     * @returns {any}
     */
    unserialize(string) {
        const json = JSON.parse(string);
        let object;
        if (json.entity !== 'Object') {
            object = eval(`const ${json.entity} = require("./entity/${json.entity}");new ${json.entity}();`);
        } else {
            object = {};
        }
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                object[key] = this._recursiveUnserializeField(json[key]);
            }
        }

        return object;
    }

    _recursiveUnserializeField(field) {
        if (field instanceof Object) {
            if (undefined !== field.entity) {
                let rec_object;
                if (field.entity !== 'Object') {
                    rec_object = eval(`const ${field.entity} = require("./entity/${field.entity}");new ${field.entity}();`);
                } else {
                    rec_object = {};
                }
                for (const f in field) {
                    if (field.hasOwnProperty(f)) {
                        rec_object[f] = this._recursiveUnserializeField(field[f]);
                    }
                }
                return rec_object;
            } else {
                return field;
            }
        } else if (field instanceof Array) {
            for (const index in field) {
                if (field.hasOwnProperty(index)) {
                    this._recursiveUnserializeField(field[index]);
                }
            }
        } else {
            return field;
        }
    }

    _recursiveSerializeObject(object) {
        if (!object instanceof Object) {
            throw new Error(`Serializer: field must have Object type, but '${object.constructor.name}' given`);
        }
        object['entity'] = object.constructor.name;
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                if (object[key] instanceof Object) {
                    this._recursiveSerializeObject(object[key]);
                }
            }
        }
    }
}

module.exports = EntitySerializer;