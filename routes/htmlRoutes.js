var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.Article.find({})
      .then(function (articles) {
        res.render("index", {
          active_home:{
            Register:true,
          },
          articulos: articles

        })
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Load save articles
  app.get("/articulos", function (req, res) {
    db.Article.find({})
      .then(function (articles) {
        res.render("articulos", {
          active_articulos:{
            Register:true,
          },
          articulos: articles

        })
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};

