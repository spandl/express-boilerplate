const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index', { title: 'Download Data from Unsplash' }, (err, html) => {
        if (err) {
            next(err);
        } else {
            res.send(html);
            res.end();
        }
    });
});

module.exports = router;
