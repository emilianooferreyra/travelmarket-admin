'use strict';

var _ = require('lodash');

exports.listFilter = (req, res, next) => {
  req.options = {
    skip: parseInt(_.get(req, 'query.skip', 0)),
    limit: parseInt(_.get(req, 'query.limit', 20)),
    sort: {
      [_.get(req, 'query.orderBy', '_id')]: _.get(req, 'query.sort', 1)
    }
  };

  // if want to perform a search, find similar to query parameters
if (req.query.like == 'true') {
  delete req.query.like
  req.query = _.reduce(req.query, (acumulator, value, key) => {
    // TODO: FIX THIS CROTADA
    if (key == 'deleted') {
      acumulator[key] = value;
    } else {
      var json = {
        [key]: new RegExp(value, 'i')
      }
      acumulator[key] = new RegExp(value, 'i')
    }
    return acumulator
  }, {})
}

  // TODO: Deep filtesring
  req.populate = _.split(_.get(req, 'query.populate', ''), ',');
  req.fields = _.split(_.get(req, 'query.fields', ''), ',');
  delete req.query.skip;
  delete req.query.limit;
  delete req.query.orderBy;
  delete req.query.sort;
  delete req.query.fields;
  delete req.query.populate;
  next();
}

exports.findOneFilter = (req, res, next) => {
  req.populate = _.split(_.get(req, 'query.populate', ''), ',');
  req.fields = _.split(_.get(req, 'query.fields', ''), ',');
  next();
}
