var expect = require('chai').expect;
var uuid = require('uuid');
var rethinkOdm = require('../');

describe('Model', function () {
  var User, ro;

  before(function () {
    ro = rethinkOdm();
    User = ro.createModel({tableName: 'users'});
  });

  before(function (done) {
    ro.run(ro.r.tableList())
    .then(function (tables) {
      if (tables.indexOf('users') === -1)
        return ro.run(ro.r.tableCreate('users'));
    })
    .nodeify(done);
  });

  after(function (done) {
    ro.run(ro.r.tableList())
    .then(function (tables) {
      if (tables.indexOf('users') !== -1)
        return ro.run(ro.r.tableDrop('users'));
    })
    .nodeify(done);
  });

  after(function () {
    ro.close();
  });

  describe('=getTable', function () {
    it('should return the table', function (done) {
      ro.run(User.table().get('x'))
      .then(function (user) {
        expect(user).to.be.null;
      })
      .nodeify(done);
    });
  });

  describe('#insert', function () {
    before(function (done) {
      ro.run(ro.r.table('users').insert({id: 'a'})).nodeify(done);
    });

    it('should insert (without id)', function (done) {
      var user = new User({name: 'Johnny'});
      user.insert()
      .then(function (user) {
        expect(user).to.be.instanceOf(User);
        expect(user).to.have.property('id');
        expect(user).to.have.property('name', 'Johnny');
      })
      .nodeify(done);
    });

    it('should insert (with id)', function (done) {
      var id = uuid();
      var user = new User({id: id, name: 'Johnny'});
      user.insert()
      .then(function (_user) {
        expect(_user).to.equal(user);
        expect(_user).to.have.property('id', id);
        expect(_user).to.have.property('name', 'Johnny');
      })
      .nodeify(done);
    });

    it('should handle errors', function (done) {
      var id = 'a';
      var user = new User({id: id, name: 'Johnny'});
      user.insert()
      .catch(function (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.match(/Duplicate primary key/);
      })
      .nodeify(done);
    });
  });

  describe('#update', function () {
    before(function (done) {
      ro.run(ro.r.table('users').insert({id: 'b'})).nodeify(done);
    });

    it('should update in database', function (done) {
      var user = new User({id: 'b', foo: 'bar'});
      user.update()
      .then(function (_user) {
        expect(_user).to.equal(user);
        expect(_user).to.have.property('id', 'b');
        expect(_user).to.have.property('foo', 'bar');
      })
      .nodeify(done);
    });

    it('should be possible to specify data', function (done) {
      var user = new User({id: 'b', a: 'a', b: 'b'});
      user.update({c: 'c'})
      .then(function (_user) {
        expect(_user).to.equal(user);
        expect(_user).to.have.property('id', 'b');
        expect(_user).to.have.property('a', 'a');
        expect(_user).to.have.property('b', 'b');
        expect(_user).to.have.property('c', 'c');
      })
      .then(function () {
        return ro.run(ro.r.table('users').get('b'));
      })
      .then(function (userInDb) {
        expect(userInDb).to.have.property('id', 'b');
        expect(userInDb).to.not.have.property('a');
        expect(userInDb).to.not.have.property('b');
        expect(userInDb).to.have.property('c', 'c');
      })
      .nodeify(done);
    });

    it('should handle "Not found" errors', function (done) {
      var user = new User({id: 'x', foo: 'bar'});
      user.update()
      .catch(function (err) {
        expect(err.message).to.equal('Not found');
      })
      .nodeify(done);
    });
  });

  describe('#delete', function () {
    before(function (done) {
      ro.run(ro.r.table('users').insert({id: 'c'})).nodeify(done);
    });

    it('should delete the document', function (done) {
      var user = new User({id: 'c'});
      user.delete()
      .then(function () {
        return ro.run(ro.r.table('users').get('c'));
      })
      .then(function (userInDb) {
        expect(userInDb).to.be.null;
      })
      .nodeify(done);
    });

    it('should do nothing if document is not found', function (done) {
      var user = new User({id: 'xxx'});
      user.delete()
      .catch(function (err) {
        expect(err).to.not.exists;
      })
      .nodeify(done);
    });
  });
});