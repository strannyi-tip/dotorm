const ORMReserved = require('../src/entity/ORMReserved');
const Entity = require('../src/entity/Entity');

test('Test entity inherit', ()=>{
    const reserved = new ORMReserved();

    expect((reserved instanceof Entity)).toBe(true);
});