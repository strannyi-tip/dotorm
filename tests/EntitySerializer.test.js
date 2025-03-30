const EntitySerializer = require('../src/EntitySerializer');

test('Test serialize/unserialize', ()=>{
    const serializer = new EntitySerializer();
    const object = {
        name: 'test name'
    };
    const serialized = '{\"name\":\"test name\",\"entity\":\"Object\"}';
    expect(serializer.serialize(object)).toBe(serialized);
    expect(serializer.unserialize(serialized)).toMatchObject({"name":"test name","entity":"Object"});
});