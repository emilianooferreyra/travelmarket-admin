'use strict';

const Note = require('../models/note.js');
const User = require('../models/user.js');
const Client = require('../models/client.js');
const Provider = require('../models/provider.js');
const Sale = require('../models/sale.js');
const ProviderPayment = require('../models/providerpayment.js');
var slug = require('slug'),
  fs = require('fs'),
  _ = require('lodash');

exports.count = (req, res) => {
  Note.count(req.query).exec(function(err, results) {
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
  Note.find(req.query, req.fields, req.options).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.get = (req, res) => {
  Note.findById(req.params.id, req.fields).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.create = async (req, res) => {
  let user = await User.findOne({username: req.body.username})
  if (req.body.clientid){
    let client = await Client.findById(req.body.clientid)
    req.body.user = user._id

    var newEntity = Note(req.body);
    newEntity.save(async function(err, note) {
      if (err)
        return res.status(400).json(err);
      else {
        await client.notes.push(note._id)
        await client.save()
        return res.status(201).json(newEntity)
      }
    }.bind(this));
  }
  else if (req.body.providerid) {
    let provider = await Provider.findById(req.body.providerid)
    req.body.provider = provider._id
    req.body.user = user._id
    var newEntity = Note(req.body);
    newEntity.save(async function(err, note) {
      if (err)
        return res.status(400).json(err);
      else {
        await provider.notes.push(note._id)
        await provider.save()
        return res.status(201).json(newEntity)
      }
    }.bind(this));
  }
  else if (req.body.saleid){
      let sale = await Sale.findById(req.body.saleid)
      req.body.sale = sale._id
      req.body.user = user._id

      var newEntity = Note(req.body);
      newEntity.save(async function(err, note) {
        if (err)
          return res.status(400).json(err);
        else {
          await sale.notes.push(note._id)
          await sale.save()
          return res.status(201).json(newEntity)
        }
      }.bind(this));
    }
    else if (req.body.providerpaymentid){
        let providerpayment = await ProviderPayment.findById(req.body.providerpaymentid)
        req.body.providerpayment = providerpayment._id
        req.body.user = user._id

        var newEntity = Note(req.body);
        newEntity.save(async function(err, note) {
          if (err)
            return res.status(400).json(err);
          else {
            await providerpayment.notes.push(note._id)
            await providerpayment.save()
            return res.status(201).json(newEntity)
          }
        }.bind(this));
      }
}

exports.update = async (req, res) => {
  let user = await User.findOne({username: req.body.username})
  req.body.user = user._id
  Note.findByIdAndUpdate(req.params.id, req.body, function(err, entity) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(entity)
  }.bind(this));
}

exports.delete = (req, res) => {
  Note.findByIdAndRemove(req.params.id, function(err, entity) {
    if (err)
      return res.status(400).json(err)
    else
      return res.json()
  })
}
