'use strict';

const ProviderPayment = require('../models/providerpayment.js');
const Provider = require('../models/provider.js');
const Client = require('../models/client.js');
const Sale = require('../models/sale.js');
const Pay = require('../models/pay.js');

var slug = require('slug'),
  fs = require('fs'),
  _ = require('lodash');

exports.count = (req, res) => {
  ProviderPayment.count(req.query).exec(function(err, results) {
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
  ProviderPayment.find(req.query, req.fields, req.options).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.get = (req, res) => {
  ProviderPayment.findById(req.params.id, req.fields).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.create = (req, res) => {
  req.body.remain = req.body.total
  var newEntity = ProviderPayment(req.body);
  newEntity.save(function(err) {
    if (err)
      return res.status(400).json(err);
    else {
      return res.status(201).json(newEntity)
    }
  }.bind(this));
}

exports.update = async (req, res) => {

  const pays = await Pay.find({
    providerpayment: req.params.id
  })
  const payed = pays.reduce((total, each) => {
    const eachImporte = each.importeConvertido ? each.importeConvertido : 0
    return eachImporte + total
  }, 0)

  req.body.remain = req.body.total - payed

  ProviderPayment.findByIdAndUpdate(req.params.id, req.body, function(err, entity) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(entity)
  }.bind(this));
}

exports.delete = (req, res) => {
  ProviderPayment.findByIdAndRemove(req.params.id, function(err, entity) {
    if (err)
      return res.status(400).json(err)
    else
      return res.json()
  })
}

exports.findProvider = async (req, res) => {
  const clients = await Client.find({
    'name': {
      '$regex': req.query.name,
      '$options': 'i'
    }
  }).select('_id')
  const clientsIds = clients.map((each) => each._id)
  const sales = await Sale.find({
    client: clientsIds
  })

  const salesId = sales.map((each) => each._id)

  const providerPayments = await ProviderPayment.find({
    sale: salesId
  }).populate(req.populate)
  return res.json(providerPayments)
}
