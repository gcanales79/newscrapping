var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {
  // A GET route for scraping the echoJS website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("http://espndeportes.espn.com/futbol/liga/_/nombre/mex.1/liga-mx").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $(".item-info-wrap").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element).children("h1").text();
        result.summary = $(element).children("p").text();
        result.link = "http://espndeportes.espn.com" + $(element).find("a").attr("href");

        //Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
        console.log(result);
      });

      // If we were able to successfully scrape and save an Article, send a message to the client

      res.send("Scrape Complete");
    });
  });

  //API to change the article info to save
  app.post("/api/articles/:id", function (req, res) {

    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          saveArticle: true
        }
      },
      { new: true }
    )
      .then(function (dbArticle) {
        res.json(dbArticle)
      })
      .catch(function (err) {
        res.json(err)
      })
  })
  //API to change the article property to unsaved
  app.post("/api/unsaved/:id", function (req, res) {

    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          saveArticle: false,
        }
      },
      { new: true }
    )
      .then(function (dbArticle) {
        res.json(dbArticle)
      })
      .catch(function (err) {
        res.json(err)
      })
  })

  app.get("/api/all", function (req, res) {

    db.Article.find({})
      .then(function (article) {
        res.json(article)
      })
      .catch(function (err) {
        res.json(err);
      });

  });

  //API to get the info of one article
  app.get("/api/article/:id", function (req, res) {
    db.Article.findOne({
      _id: req.params.id
    })
      .populate("note")
      .then(function (dbArticle) {
        res.json(dbArticle)
      })
      .catch(function (err) {
        res.json(err)
      })
  })

  // Route for saving/updating an Article's associated Note
  app.post("/addnote/:id", function (req, res) {
    db.Note.create(req.body)
      .then(function (dbNote) {

        // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
      })
      .then(function (dbArticle) {
        // If the User was updated successfully, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });

  });

  app.get("/deletenote/:id", function (req, res) {
    db.Note.deleteOne({
      _id: req.params.id
    })
      .then(function (dbNote) {
        res.json(dbNote)
      })
      .catch(function (err) {
        res.json(err)
      })
  })



};
