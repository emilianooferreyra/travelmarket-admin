'use strict';

const Sale = require('../models/sale.js');
const Client = require('../models/client.js');
const Pay = require('../models/pay.js');

var slug = require('slug'),
  fs = require('fs'),
  _ = require('lodash');

exports.count = (req, res) => {
  Sale.count(req.query).exec(function(err, results) {
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
  Sale.find(req.query, req.fields, req.options).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.get = (req, res) => {
  Sale.findById(req.params.id, req.fields).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}
exports.findClient = (req, res) => {
  const nameQuery = req.query.name? req.query.name : ''
  const dniQuery = req.query.dni? req.query.dni : ''
  const query = []
  if (nameQuery){
    query.push({ 'name' : { '$regex' : nameQuery, '$options' : 'i' }})
  }
  if (dniQuery){
    query.push({ 'dni' : { '$regex' : dniQuery, '$options' : 'i' }})
  }
  Client.find( {$or:query}
  ).select('_id').exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else{
      const ids = results.map((each)=>each._id)
      Sale.find({client: ids}).populate(req.populate).exec(function(err,result){
        return res.json(result)
      })
      }
  });
}

exports.create = (req, res) => {
  let date = new Date
  req.body.code = date.getTime().toString()
  var total =  req.body.impTm + req.body.tx
  req.body.profit = req.body.impTm - req.body.impNeto
  req.body.benefit= ((req.body.profit/req.body.impNeto)*100).toFixed(2)
  req.body.total = req.body.impTm + req.body.tx
  req.body.remain = req.body.total

  var newEntity = Sale(req.body);
  newEntity.save(function(err) {
    if (err)
      return res.status(400).json(err);
    else {
      return res.status(201).json(newEntity)
    }
  }.bind(this));
}

exports.update = async (req, res) => {
  req.body.profit = req.body.impTm - req.body.impNeto
  req.body.benefit= ((req.body.profit/req.body.impNeto)*100).toFixed(2)
  req.body.total = req.body.impTm + req.body.tx

  const pays = await Pay.find({sale: req.params.id})
  const payed = pays.reduce((total,each)=>{
    const eachImporte = each.importeConvertido ? each.importeConvertido : 0
    return eachImporte + total
  },0)

  req.body.remain = req.body.total - payed

  Sale.findByIdAndUpdate(req.params.id, req.body, function(err, entity) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(entity)
  }.bind(this));
}

exports.delete = (req, res) => {
  Sale.findByIdAndRemove(req.params.id, function(err, entity) {
    if (err)
      return res.status(400).json(err)
    else
      return res.json()
  })
}
