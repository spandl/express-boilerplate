const express = require('express');

const router = express.Router();

const unsplashHelper = require('../helpers/unsplash');

router.get('/', (req, res, next) => {
    res.render('download', { title: 'Download Data from Unsplash', data: unsplashHelper.getData() }, (err, html) => {
        if (err) {
            next(err);
        } else {
            res.send(html);
            res.end();
        }
    });
});

module.exports = router;
