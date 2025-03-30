const ORM = require('../src/ORM');
const Test = require('../src/entity/Test');
const EntitySerializer = require('../src/EntitySerializer');

class localStorage
{
    constructor() {
        this._storage = [];
    }

    setItem(key, value) {
        this._storage[key] = value;
    }

    getItem(key) {
        return this._storage[key];
    }

    clear() {
        this._storage = [];
    }
}


test('Test for insert', ()=>{
    let storage = new localStorage();
    let serializer = new EntitySerializer();
    let orm = new ORM(storage);
    let test = new Test();
    test.name = 'The test name';
    let s_test = new Test();
    s_test.name = 'The test name';
    s_test.id = 0;
    let serialized = serializer.serialize(s_test);
    let unserialized = serializer.unserialize(serialized);
    let pointer = orm.with(test);

    expect(pointer.getAll()).toStrictEqual([]);
    pointer.insert();
    expect(pointer.getAll()).toStrictEqual([unserialized]);
    storage.clear();
});

test('Test for delete', ()=>{
    let storage = new localStorage();
    let serializer = new EntitySerializer();
    let orm = new ORM(storage);
    let test = new Test();
    test.name = 'The test name';
    let s_test = new Test();
    s_test.name = 'The test name';
    s_test.id = 0;
    let serialized = serializer.serialize(s_test);
    let unserialized = serializer.unserialize(serialized);
    let pointer = orm.with(test);

    expect(pointer.getAll()).toStrictEqual([]);
    pointer.insert();
    expect(pointer.getAll()).toStrictEqual([unserialized]);
    let founded = orm.with(test).getOne(0);
    orm.with(founded).delete();
    expect(pointer.getAll()).toStrictEqual([]);
    storage.clear();
});

test('Test for update', ()=>{
    let storage = new localStorage();
    let orm = new ORM(storage);
    let test = new Test();
    test.name = 'The test name';
    orm.with(test).insert();
    let founded = orm.with(test).getOne(0);
    expect(founded.name).toBe('The test name');
    founded.name = 'The test name long';
    orm.with(founded).update();
    let updated = orm.with(test).getOne(0);
    expect(updated.name).toBe('The test name long');
});

test('Test for limit/offset', ()=>{
    let storage = new localStorage();
    let orm = new ORM(storage);
    let test = new Test();
    test.name = 'The test name';
    orm.with(test).insert();
    orm.with(test).insert();
    orm.with(test).insert();
    orm.with(test).insert();
    orm.with(test).insert();
    orm.with(test).insert();
    orm.with(test).insert();
    orm.with(test).insert();
    orm.with(test).insert();
    orm.with(test).insert();

    expect(orm.with(test).getAll().length).toBe(10);
    expect(orm.with(test).getAll(5).length).toBe(5);
    expect(orm.with(test).getAll(7).length).toBe(7);
    expect(orm.with(test).getAll(3).length).toBe(3);
    expect(orm.with(test).getAll(5, 3).length).toBe(5);
    storage.clear();
});

test('Test for search with params', ()=>{
    let storage = new localStorage();
    let orm = new ORM(storage);
    let test = new Test();
    let test2 = new Test();
    test.name = 'The test name';
    test.age = 99;
    test2.name = 'Second test';
    test2.age = 17;
    orm.with(test).insert();
    orm.with(test2).insert();

    let founded_99 = orm.with(test).findAll({age: (age)=>{return age > 17;}});
    expect(founded_99.length).toBe(1);
    expect(founded_99[0].age).toBe(99);
    let founded_17 = orm.with(test).findAll({age: (age)=>{return age < 99;}});
    expect(founded_17.length).toBe(1);
    expect(founded_17[0].age).toBe(17);
    let founded_name = orm.with(test).findAll({name: (name)=>{return name === 'Second test';}});
    expect(founded_name.length).toBe(1);
    expect(founded_name[0].name).toBe('Second test');
    storage.clear();
});