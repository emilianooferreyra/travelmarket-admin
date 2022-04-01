"use strict";

const express = require("express"),
  packages = require("./controllers/packages"),
  posts = require("./controllers/posts"),
  clients = require("./controllers/clients"),
  providers = require("./controllers/providers"),
  sales = require("./controllers/sales"),
  pays = require("./controllers/pays"),
  notes = require("./controllers/notes"),
  providerpayments = require("./controllers/providerpayments"),
  filterMiddleware = require("./middlewares/filterMiddleware");

var passport = require("passport");
var fs = require("fs"),
  slug = require("slug"),
  multer = require("multer");

require("./passport")(passport);

var router = require("./authentication");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var sluggedTitle;
    var uploadDir;
    if (req.body.title) {
      sluggedTitle = slug(req.body.title);
      uploadDir = "uploads/" + sluggedTitle;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
    } else {
      uploadDir = "uploads/posts";
      if (!fs.existsSync("uploads/posts")) {
        fs.mkdirSync("uploads/posts");
      }
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({
  storage: storage,
});
var cpUpload = upload.fields([
  {
    name: "front",
    maxCount: 1,
  },
  {
    name: "gallery",
    maxCount: 20,
  },
]);

router.get("/api", function (req, res) {
  res.json("Get Travel Market");
});

// Packages
router.get("/api/packages/destinations", packages.destinations);
router.post("/api/packages/search", packages.search);
router.get("/api/packages/count", filterMiddleware.listFilter, packages.count);
router.get("/api/packages/:id", filterMiddleware.findOneFilter, packages.get);
router.get("/api/packages", filterMiddleware.listFilter, packages.list);
router.put(
  "/api/packages/:id",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  packages.update
);
router.post(
  "/api/packages",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  packages.create
);
router.delete(
  "/api/packages/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  packages.delete
);

// Posts
router.get("/api/posts", filterMiddleware.listFilter, posts.list);
router.get("/api/posts/count", filterMiddleware.listFilter, posts.count);
router.get("/api/posts/:id", filterMiddleware.findOneFilter, posts.get);
router.put(
  "/api/posts/:id",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  posts.update
);
router.post(
  "/api/posts",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  posts.create
);
router.delete(
  "/api/posts/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  posts.delete
);

// clients
router.get("/api/clients", filterMiddleware.listFilter, clients.list);
router.get("/api/clients/count", filterMiddleware.listFilter, clients.count);
router.get("/api/clients/:id", filterMiddleware.findOneFilter, clients.get);
router.put(
  "/api/clients/:id",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  clients.update
);
router.post(
  "/api/clients",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  clients.create
);
router.delete(
  "/api/clients/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  clients.delete
);

// clients
router.get("/api/notes", filterMiddleware.listFilter, notes.list);
router.get("/api/notes/count", filterMiddleware.listFilter, notes.count);
router.get("/api/notes/:id", filterMiddleware.findOneFilter, notes.get);
router.put(
  "/api/notes/:id",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  notes.update
);
router.post(
  "/api/notes",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  notes.create
);
router.delete(
  "/api/notes/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  notes.delete
);

// providers
router.get("/api/providers", filterMiddleware.listFilter, providers.list);
router.get(
  "/api/providers/count",
  filterMiddleware.listFilter,
  providers.count
);
router.get("/api/providers/:id", filterMiddleware.findOneFilter, providers.get);
router.put(
  "/api/providers/:id",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  providers.update
);
router.post(
  "/api/providers",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  providers.create
);
router.delete(
  "/api/providers/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  providers.delete
);

// sales
router.get("/api/sales", filterMiddleware.listFilter, sales.list);
router.get(
  "/api/sales/findByClient",
  filterMiddleware.listFilter,
  sales.findClient
);
router.get("/api/sales/count", filterMiddleware.listFilter, sales.count);
router.get("/api/sales/:id", filterMiddleware.findOneFilter, sales.get);
router.put(
  "/api/sales/:id",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  sales.update
);
router.post(
  "/api/sales",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  sales.create
);
router.delete(
  "/api/sales/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  sales.delete
);

// pays
router.get("/api/pays", filterMiddleware.listFilter, pays.list);
router.get("/api/pays/count", filterMiddleware.listFilter, pays.count);
router.get("/api/pays/:id", filterMiddleware.findOneFilter, pays.get);
router.put(
  "/api/pays/:id",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  pays.update
);
router.post(
  "/api/pays",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  pays.create
);
router.delete(
  "/api/pays/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  pays.delete
);

// providerpayment
router.get(
  "/api/providerpayments",
  filterMiddleware.listFilter,
  providerpayments.list
);
router.get(
  "/api/providerpayments/findProvider",
  filterMiddleware.listFilter,
  providerpayments.findProvider
);
router.get(
  "/api/providerpayments/count",
  filterMiddleware.listFilter,
  providerpayments.count
);
router.get(
  "/api/providerpayments/:id",
  filterMiddleware.findOneFilter,
  providerpayments.get
);
router.put(
  "/api/providerpayments/:id",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  providerpayments.update
);
router.post(
  "/api/providerpayments",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    cpUpload,
  ],
  providerpayments.create
);
router.delete(
  "/api/providerpayments/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  providerpayments.delete
);

module.exports = router;
