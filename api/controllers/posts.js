'use strict';

const Post = require('../models/post.js');
const Image = require('../models/image.js');
var slug = require('slug'),
  fs = require('fs'),
  _ = require('lodash');

exports.count = (req, res) => {
  Post.count(req.query).exec(function(err, results) {
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
  Post.find(req.query, req.fields, req.options).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.get = (req, res) => {
  Post.findById(req.params.id, req.fields).populate(req.populate).exec(function(err, results) {
    if (err)
      return res.status(400).json(err);
    else
      return res.json(results)
  });
}

exports.create = (req, res) => {
  if (req.body.title != undefined) {
    req.body.slug = slug(req.body.title)
  }
  var newEntity = Post(req.body);
  newEntity.save(function(err) {
    if (err)
      return res.status(400).json(err);
    else {
      // save front image
      this.saveFrontFile(req.files['front'][0], req.body.title, newEntity)

      if (!_.isUndefined(req.files['gallery'])) {
        exports.saveGalleryFiles(newEntity, req.body.title, req.files['gallery'])
      }
      return res.status(201).json(newEntity)
    }
  }.bind(this));
}

exports.update = (req, res) => {
  if (req.body.title != undefined) {
    req.body.slug = slug(req.body.title)
    var updatedSlug = true;
  }

  var deletedImages = req.body['deletedImages']
  if (!_.isUndefined(deletedImages)) {
    this.deleteMultipleImages(deletedImages)
  }

  if (!_.isUndefined(updatedSlug)) {
    Post.findById(req.params.id, function(err, entity) {
      fs.rename('uploads/' + entity.slug, 'uploads/' + req.body.slug, function(err) {
        if (err)
          console.log(err)
      })
    })
  }

  Post.findByIdAndUpdate(req.params.id, req.body, function(err, entity) {
    if (err)
      return res.status(400).json(err);
    else
      this.uploadImages(req, res, entity)
  }.bind(this));
}

exports.delete = (req, res) => {
  Post.findByIdAndRemove(req.params.id, function(err, entity) {
    if (err)
      return res.status(400).json(err)
    else
      return res.json()
  })
}

exports.uploadImages = (req, res, modifiedPost) => {
  if (!_.isUndefined(req.files['front'])) {
    // delete front image
    this.deleteImage(modifiedPost.front);

    this.saveFrontFile(req.files['front'][0], req.body.title, modifiedPost)

  }
  if (!_.isUndefined(req.files['gallery'])) {
    this.saveGalleryFiles(modifiedPost, req.body.title, req.files['gallery'])
  }
  return res.json(modifiedPost)
}

exports.deleteMultipleImages = (images) => {
  _.forEach(images, function(image) {
    this.deleteImage(image)
  }.bind(this))
}

exports.deleteImage = (image) => {
  Image.findByIdAndRemove(image, function(err, entity) {
    if (err)
      console.log('error deleting front image of post' + entity)
    else
      console.log('image deleted')
  })
}

exports.saveFrontFile = (frontFile, title, modifiedEntity) => {

  var image = Image({
    front: true,
    post: modifiedEntity._id,
    source: 'uploads/' + slug(title) + '/' + frontFile.originalname
  })
  image.save(function(err, savedImage) {
    if (err)
      console.log('image error' + err)
    else
      console.log('front image saved')
    modifiedEntity.front = savedImage._id
    modifiedEntity.save(function(err, newpost) {})
  })
}

exports.saveGalleryFiles = (modifiedEntity, title, images) => {
  var imgCount = images.length;
  console.log('image count ' + imgCount)
  _.forEach(images, function(file) {
    var image = Image({
      post: modifiedEntity._id,
      source: 'uploads/' + slug(title) + '/' + file.filename
    })
    image.save(function(err, galleryImage) {
      modifiedEntity.images.push(galleryImage);
      imgCount--;
      if (imgCount == 0) {
        modifiedEntity.save(function(err, newpost) {
          console.log('\n\n')
          console.log(newpost)
          console.log('Finish gallery images saved')
        })
      }
      if (err)
        console.log('image error' + err)
      else
        console.log('Gallery image saved')
    })
  });
}
