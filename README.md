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

// Create the User model
var User = ro.Model.extend({
  tableName: 'users'
});

// Create a new User
var user = new User({
  name: 'Johnny'
});

// Save it.
user.save().then(function (user) {
  // ...
});

```

## License

MIT