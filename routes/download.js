var express = require("express");
var router = express.Router();

const unsplashHelper = require('../helpers/unsplash');

router.get("/", function(req, res, next) {
    res.render("download", { title: "Download Data from Unsplash", data: unsplashHelper.getData() }, function(err, html) {
        if (err) {
            next(err);
        } else {
            res.send(html); 
            res.end();
        }
    });
});

module.exports = router;
