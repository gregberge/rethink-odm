# rethink-odm
[![Build Status](https://travis-ci.org/neoziro/rethink-odm.svg?branch=master)](https://travis-ci.org/neoziro/rethink-odm)
[![Dependency Status](https://david-dm.org/neoziro/rethink-odm.svg?theme=shields.io)](https://david-dm.org/neoziro/rethink-odm)
[![devDependency Status](https://david-dm.org/neoziro/rethink-odm/dev-status.svg?theme=shields.io)](https://david-dm.org/neoziro/rethink-odm#info=devDependencies)

Simple Object Document Mapper for RethinkDB.

## Install

```
npm install rethink-odm
```

## Usage

```js
var ro = require('rethink-odm')();

// Run command without waiting connection to be ready.
ro.run(ro.r.now()).then(function (now) {
  // ...
});

// Create the model "User".
var User = ro.createModel({
  tableName: 'users'
});

// Create a new User.
var user = new User({
  name: 'Johnny'
});

// Save it.
user.save().then(function (user) {
  // ...
});

```

### rethinkOdm(options) / rethinkOdm.createClient(options)

Create a new rethinkOdm client. To know avalaible options, please refer to [rethinkdb documentation](http://rethinkdb.com/api/javascript/connect/).

```js
var ro = rethinkOdm({host: 'localhost'});
```

### ro.r

Expose the rethinkdb module.

```js
ro.r.now();
```

### ro.run(command, [cb])

Run a command using the internal rethink odm connection. The advantage is that you don't have to wait connection to be ready.

```js
ro.run(ro.r.now()).then(function (now) {
  // ... 
});
```

### ro.createModel(options)

Create a new model.

- tableName: Name of the table

```js
var User = ro.createModel({tableName: 'users'});
```

### Model.table()

Return the table linked to the model.

```js
ro.run(User.table().get('1a487dc0-f6ec-11e3-a3ac-0800200c9a66'));
```

### new Model(data)

Create a new instance of the model.

```js
var user = new User({name: 'Johnny'});
```

### model.insert([cb])

Insert the model.

```js
var user = new User({name: 'Johnny'});
user.insert().then(function (user) {
  // ...
});
```

### model.update([data], [cb])

Update the model.

```js
var user = new User({
  id: '1a487dc0-f6ec-11e3-a3ac-0800200c9a66',
  name: 'Johnny'
});
user.update().then(function (user) {
  // ...
});
```

### model.delete()

Delete the model.

```js
var user = new User({id: '1a487dc0-f6ec-11e3-a3ac-0800200c9a66'});
user.delete().then(function () {
  // ...
});
```

## License

MIT