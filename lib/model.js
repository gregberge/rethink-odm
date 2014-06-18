/**
 * Module dependencies.
 */

var _ = require('lodash');

/**
 * Expose module.
 */

exports.create = createModel;

/**
 * Create a new model.
 *
 * @param {Client} client
 * @param {object} options
 * @param {string} options.tableName
 * @returns {Model}
 */

function createModel(client, options) {

  /**
   * Privates properties.
   */

  var table = client.r.table(options.tableName);

  /**
   * Create a new instance of Model.
   *
   * @param {object} data
   */

  function Model(data) {
    _.extend(this, data);
  }

  /**
   * Return the table associated to the model.
   *
   * @returns {TermBase}
   */

  Model.table = function () {
    return table;
  };

  /**
   * Insert the document.
   *
   * @param {function} cb
   */

  Model.prototype.insert = function (cb) {
    var model = this;

    return client.run(table.insert(this))
    .catch(function (err) {
      console.log('ERROR', err);
    })
    .then(function (res) {
      if (res.first_error) throw new Error(res.first_error);
      if (res.generated_keys) model.id = res.generated_keys[0];
      return model;
    })
    .nodeify(cb);
  };

  /**
   * Update the document.
   *
   * @param {object} [data]
   * @param {function} cb
   */

  Model.prototype.update = function (data, cb) {
    var model = this;

    // update(cb)
    if (_.isFunction(data)) {
      cb = data;
      data = null;
    }

    data = data || this;

    return client.run(table.get(this.id).update(data))
    .then(function (res) {
      if (res.skipped) throw new Error('Not found');
      if (res.first_error) throw new Error(res.first_error);
      model = _.extend(model, data);
      return model;
    })
    .nodeify(cb);
  };

  /**
   * Delete the document.
   *
   * @param {function} cb
   */

  Model.prototype.delete = function (cb) {
    return client.run(table.get(this.id).delete())
    .then(function (res) {
      if (res.first_error) throw new Error(res.first_error);
    })
    .nodeify(cb);
  };

  return Model;
}