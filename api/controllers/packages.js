'use strict';

const Package = require('../models/package.js');
const Image = require('../models/image.js');

var _ = require('lodash');

exports.count = (req, res) => {
  Package.count(req.query).exec(function(err, results) {
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
  Package.find(req.query, req.fields, req.options).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.create = (req, res) => {
  var newEntity = Package(req.body);
  newEntity.save(function(err) {
    if (err)
      return res.status(400).json(err);
    else if (!_.isUndefined(req.files['front'])) {
      var frontFile = req.files['front'][0]
      var image = Image({
        front: true,
        post: newEntity._id,
        source: 'uploads/posts/' + frontFile.originalname
      })
      image.save(function(err, savedImage) {
        newEntity.front = savedImage._id
        newEntity.save(function(err, newpost) {})
        if (err)
          console.log('image error' + err)
        else
          console.log('front image saved')
      })
    }
    return res.status(201).json(newEntity)
  });
}

exports.get = (req, res) => {
  Package.findById(req.params.id, req.fields).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.update = (req, res) => {
  Package.findByIdAndUpdate(req.params.id, req.body, function(err, entity) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(entity)
  });
}

exports.delete = (req, res) => {
  Package.findByIdAndRemove(req.params.id, function(err, entity) {
    if (err)
      return res.status(400).json(err)
    else
      return res.json()
  })
}

exports.destinations = (req, res) => {
  Package.aggregate([
    {
      "$group": {
        "_id": null,
        city: {
          $addToSet: "$city"
        },
        country: {
          $addToSet: "$country"
        },
        beach: {
          $addToSet: "$beach"
        }
      }
    }
  ]).exec(function(err, packages) {
    packages = packages[0];
    var destinations = _.union(packages.city, packages.country, packages.beach)
    return res.json(destinations);
  })
}

exports.search = (req, res) => {
  req.body.query = _.isUndefined(req.body.query)
    ? {}
    : req.body.query
  Package.find().or([
    {
      city: req.body.destination
    }, {
      country: req.body.destination
    }, {
      beach: req.body.destination
    }
  ]).and([req.body.query]).exec(function(err, packages) {
    if (err)
      console.log(err)
    else
      return res.json(packages);
    }
  )
}
