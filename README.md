# dotORM
[![tests](https://github.com/strannyi-tip/dotorm/actions/workflows/npm-test.yml/badge.svg?event=pull_request)](https://github.com/strannyi-tip/dotorm/actions/workflows/npm-test.yml)
### Простая ORM для javascript localStorage и sessionStorage

## Инициализация

1. Передать хранилище в конструктор:
```javascript
const orm = new ORM(localStorage);
```
По умолчанию используется `localStorage`

2. Унаследовать `entity/Entity`:
```javascript
require('entity/Entity');

class MyEntity extends Entity
{
    constructor() {
        super("table_name");
    }
}
```
3. Примеры использования:

```javascript
let Player = new Player();
player.name = 'Super Player';

let orm = new ORM();

let result = orm
                .with(player)//Привязываем экземпляр сущности унаследованной от `entity/Entity`
                .getAll();//Получаем все записи
```
### Метод `getAll` имеет два параметра:
`limit` используется для ограничения количества получаемых записей\
`offset` используется для указания смещения внутри выборки записей

```javascript
let result = orm
            .with(player)
            .getAll(10);//Получаем 10 записей
let single_player = orm
                .with(player)
                .getOne(1);//Получаем одну запись
```
Для удаления записи, объект должен содержать идентификатор. Идентификатор присваивается объекту автоматически при добавлении записи

```javascript
orm.with(single_player).delete();//Удаляем запись
```

Для обновления объекта достаточно изменить одно или несколько полей и вызвать метод `update()`

```javascript
single_player.name = 'Updated name';
orm.with(single_player).update();//Обновляем запись
```

Для добавления записи, создайте экземпляр нужной сущности и заполните его поля\
``Обратите внимание, поле id зарезервировано и не может быть использовано.``
```javascript
orm.with(player).insert();//Добавляем запись
```

Для поиска по записям используется метод `findAll()` который принимает два параметра:
1. `conditions` объект для хранения условий поиска, вида:
```javascript
{id: (id) => id === 3}
```
2. `limit` ограничение количества получаемых записей, по умолчанию равно 0 (не ограничивать).
