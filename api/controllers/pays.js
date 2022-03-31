'use strict';

const Pay = require('../models/pay.js');
const Sale = require('../models/sale.js');
const ProviderPayment = require('../models/providerpayment.js');
var slug = require('slug'),
  fs = require('fs'),
  _ = require('lodash');

exports.count = (req, res) => {
  Pay.count(req.query).exec(function(err, results) {
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
  Pay.find(req.query, req.fields, req.options).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.get = (req, res) => {
  Pay.findById(req.params.id, req.fields).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.create = (req, res) => {
  if(req.body.sale){
    Sale.findById(req.body.sale, function(err,associatedSale){
      if (associatedSale.currency !== req.body.currency){
        req.body.importeConvertido = (req.body.currency == 'ars') ? req.body.importe / req.body.exchangeRate : req.body.importe * req.body.exchangeRate
      }
      else{
        req.body.importeConvertido = req.body.importe
      }
      var newEntity = Pay(req.body);

      newEntity.save(function(err) {
        if (err)
          return res.status(400).json(err);
        else {
          associatedSale.remain = associatedSale.remain - req.body.importeConvertido
          associatedSale.save(function(err){
            if (err)
              return res.status(400).json(err);
              else{
                return res.status(201).json(newEntity)
              }
          })
        }
      }.bind(this));
    }.bind(this))
  }
  else if(req.body.providerpayment){
    ProviderPayment.findById(req.body.providerpayment, function(err,providerPayment){
      if (providerPayment.currency !== req.body.currency){
        req.body.importeConvertido = (req.body.currency == 'ars') ? req.body.importe / req.body.exchangeRate : req.body.importe * req.body.exchangeRate
      }
      else{
        req.body.importeConvertido = req.body.importe
      }
      var newEntity = Pay(req.body);

      newEntity.save(function(err) {
        if (err)
          return res.status(400).json(err);
        else {
          providerPayment.remain = providerPayment.remain - req.body.importeConvertido
          providerPayment.save(function(err){
            if (err)
              return res.status(400).json(err);
              else{
                return res.status(201).json(newEntity)
              }
          })
        }
      }.bind(this));
    }.bind(this))
  }
}

exports.update = (req, res) => {
  Pay.findByIdAndUpdate(req.params.id, req.body, function(err, entity) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(entity)
  }.bind(this));
}

exports.delete = (req, res) => {
  Pay.findById(req.params.id, function(err, entity) {
    if(entity.sale){
      Sale.findById(entity.sale, function(err,sale){
        sale.remain = sale.remain + entity.importeConvertido
        sale.save(function(err,updatedSale){
          Pay.findByIdAndRemove(req.params.id, function(err, entity) {
            if (err)
              return res.status(400).json(err)
            else
              return res.json()
            })
        })
      })
    }
    if(entity.providerpayment){
      ProviderPayment.findById(entity.providerpayment, function(err,providerpayment){
        providerpayment.remain = providerpayment.remain +entity.importeConvertido
        providerpayment.save(function(err,updatedSale){
          Pay.findByIdAndRemove(req.params.id, function(err, entity) {
            if (err)
              return res.status(400).json(err)
            else
              return res.json()
            })
        })
      })
    }
  })
}
