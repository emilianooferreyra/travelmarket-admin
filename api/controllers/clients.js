'use strict';

const Client = require('../models/client.js');
var slug = require('slug'),
  fs = require('fs'),
  _ = require('lodash');

exports.count = (req, res) => {
  Client.count(req.query).exec(function(err, results) {
    results = {
      count: results
    }
    if (err)
      return res.status(400).json(err);
    else
      return res.status(200).json(results)
  });
}

exports.list = (req, res) => {
  Client.find(req.query, req.fields, req.options).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.get = (req, res) => {
  Client.findById(req.params.id, req.fields).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.create = (req, res) => {
  var newEntity = Client(req.body);
  newEntity.save(function(err) {
    if (err)
      return res.status(400).json(err);
    else {
      return res.status(201).json(newEntity)
    }
  }.bind(this));
}

exports.update = (req, res) => {
  Client.findByIdAndUpdate(req.params.id, req.body, function(err, entity) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(entity)
  }.bind(this));
}

exports.delete = (req, res) => {
  Client.findByIdAndRemove(req.params.id, function(err, entity) {
    if (err)
      return res.status(400).json(err)
    else
      return res.json()
  })
}
