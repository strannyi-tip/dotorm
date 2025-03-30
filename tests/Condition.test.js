const Condition = require('../src/Condition');

test('Test for condition is true/false correctly', ()=>{
    const object_true = {
        value: true,
    };
    const object_false = {
        value: false,
    };
    const object_key_check = {
        entity: 'test'
    };
    const condition = new Condition('value', (val)=>{return val;});
    const condition_key_check = new Condition('undfnd', (val)=>{return val;});

    expect(condition.is(object_true)).toBe(true);
    expect(condition.is(object_false)).toBe(false);
    expect(()=>condition_key_check.is(object_key_check)).toThrow('Condition: Entity test has not field undfnd.');
});