const express = require('express');

const router = express.Router();
const unsplashHelper = require('../helpers/unsplash');

router.get('/', (req, res, next) => {
    res.render(
        'download',
        { title: 'Home page to 4 endpoints', data: 'disabled' },
        (err, html) => {
            // unsplashHelper.getPhotoInfoFromFileList()
            if (err) {
                next(err);
            } else {
                res.send(html);
                res.end();
            }
        },
    );
});


router.get('/getPhotoList', (req, res) => {
    res.render('download', { title: 'Reduce all Photo JSON files to one JSON', data: 'getPhotoList: disabled' });
});

router.get('/getPhotoInfoFromFileList', (req, res) => {
    res.render('download', { title: 'Reduce all Photo JSON files to one JSON', data: 'getPhotoInfoFromFileList: disabled' });
});

router.get('/reducePhotoJSON', (req, res) => {
    res.render('download', { title: 'Reduce all Photo JSON files to one JSON', data: unsplashHelper.reducePhotoJSON() });
});

router.get('/getRandomPhotoJson', (req, res) => {
    res.render('download', { title: 'Reduce all Photo JSON files to one JSON', data: 'getRandomPhotoJson: disabled' });
});


module.exports = router;
