const OneToMany = require('../src/relation/OneToMany');
const Relation = require('../src/Relation');

test('Test for instance base class', ()=>{
    const object = new OneToMany('Test', 'test_id', 'id');

    expect(object).toBeInstanceOf(Relation);
});

test('Test for field setted correctly', ()=>{
    const object = new OneToMany('Test', 'test_id', 'id');

    expect(object.related_entity).toBe('Test');
    expect(object.related_field).toBe('test_id');
    expect(object.owned_field).toBe('id');
});