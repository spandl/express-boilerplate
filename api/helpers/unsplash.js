/* eslint-disable camelcase */
const fs = require('fs');
require('isomorphic-fetch');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const Unsplash = require('unsplash-js').default;
const { toJson } = require('unsplash-js');
const jsonfile = require('jsonfile');

const palette = require('image-palette');
const pixels = require('image-pixels');

const folder = path.join(__dirname, '../..', 'data/');
const fileNameStub = 'test-';
const requestURL = 'https://api.unsplash.com/';

const maxData = 2;

dotenv.config();

// TO DO : split into several files
// Place variables in environment variables or pass with function (maxLoop)

const unsplash = new Unsplash({
    applicationId: process.env.UNSPLASH_applicationId,
    secret: process.env.UNSPLASH_secret,
});

const maxLoop = 0;

class UnsplashHelper {
    static async createColorPalettes() {
        // Get download link for all images
        const ImageList = await jsonfile.readFile(`${folder}unsplash-d3.json`);

        // Download small version of all available photos
        const promises = [];

        ImageList.forEach((file) => {
            const imageURL = `${
                file.urls.raw
            }&w=200&h=200&fit=crop&q=85&fm=jpg&crop=entropy&cs=srgb`;
            const fileDestination = `${folder}download/file-${file.id}.jpg`;
            promises.push(
                this.downloadImage(imageURL, fileDestination).then((img) => {
                    // console.log(`Image ${img} downloaded`);
                }).catch((err) => {
                    console.log(`download error: ${err}`);
                }),
            );
        });

        await Promise.all(promises);
        console.log('Image download completed');

        // Extract color palettes
        const colorPalette = [];
        const palettePromises = [];
        // create second promise array and wait for all, then write json file.
        ImageList.forEach((file, index) => {
            const fileName = `${folder}download/file-${file.id}.jpg`;
            colorPalette[index] = {};
            colorPalette[index].id = file.id;
            colorPalette[index].colors = {};
            palettePromises.push(
                this.getColorPaletteFromImage(fileName, 5).then((palettte) => {
                    colorPalette[index].colors.palette = palettte;
                    // console.log(`Palette ${index} created`);
                }).catch((err) => {
                    console.log(`Palette error: ${err} // ${index}`);
                }),
                this.getColorPaletteFromImage(fileName, 2).then((color) => {
                    colorPalette[index].colors.main = color;
                    // console.log(`Color ${index} created`);
                }).catch((err) => {
                    console.log(`Palette Color error: ${err} // ${index}`);
                }),
            );
        });

        await Promise.all(palettePromises);
        console.log('All Palettes created');

        jsonfile.writeFile(`${folder}unsplash-colors.json`, colorPalette, (err) => {
            if (err) console.error(err);
            console.log('DONE!!!');
        });
    }

    static async getColorPaletteFromImage(file, num) {
        const { colors } = palette(await pixels(file), num);

        return new Promise((resolve) => {
            resolve(colors);
        });
    }

    static async downloadImage(url, dest) {
        const writer = fs.createWriteStream(dest);

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve(dest));
            writer.on('error', reject);
        });
    }

    static reducePhotoJSON(type) {
        this.readFileNames('photos/').then((array) => {
            // Make sure only valid files are processed
            const result = array.filter(filename => filename.includes(fileNameStub));
            const promises = [];
            const photoJSON = [];

            result.forEach((file, index) => {
                if (index < maxData) {
                    promises.push(
                        this.reduceJSON(`${folder}photos/${file}`, type).then((obj) => {
                            photoJSON.push(obj);
                        }),
                    );
                }
            });

            Promise.all(promises).then(() => {
                // Save JSON Array as single file
                jsonfile.writeFile(`${folder}unsplash-d3.json`, photoJSON, (err) => {
                    if (err) console.error(err);
                });
            });
        });
    }

    static reduceJSON(theFile, type) {
        return new Promise((resolve, reject) => {
            jsonfile
                .readFile(theFile)
                .then((obj) => {
                    // Do your work of copying only nodes that are required
                    const reducedJSON = {};

                    // Generic Data
                    reducedJSON.id = obj.id;
                    reducedJSON.urls = {};
                    reducedJSON.urls.raw = obj.urls.raw;

                    if (type === 'color' || type === 'all') {
                        reducedJSON.created_at = obj.created_at;
                        reducedJSON.color = obj.color;

                        // User data
                        reducedJSON.user = {};
                        reducedJSON.user.id = obj.user.id;
                        reducedJSON.user.username = obj.user.username;
                        reducedJSON.user.first_name = obj.user.first_name;
                        reducedJSON.user.last_name = obj.user.last_name;
                    }
                    // Detailed data
                    if (type === 'all') {
                        reducedJSON.user.location = obj.user.location;
                        reducedJSON.width = obj.width;
                        reducedJSON.height = obj.height;
                        reducedJSON.updated_at = obj.updated_at;
                        reducedJSON.description = obj.description;
                        reducedJSON.exif = obj.exif;
                        reducedJSON.location = obj.location;
                        reducedJSON.tags = obj.tags;
                        reducedJSON.sponsored = obj.sponsored;
                        reducedJSON.sponsored_by = obj.sponsored_by;
                        reducedJSON.sponsored_impressions_id = obj.sponsored_impressions_id;
                        reducedJSON.likes = obj.likes;
                        reducedJSON.views = obj.views;
                        reducedJSON.downloads = obj.downloads;
                    }

                    resolve(reducedJSON);
                })
                .catch(error => reject(error));
        });
    }

    static getPhotoInfoFromFileList() {
        this.readFileNames('').then((array) => {
            const result = array.filter(filename => filename.includes(fileNameStub));
            const photoIdArray = [];
            const promises = [];

            result.forEach((file) => {
                promises.push(
                    this.readPhotoIDs(file).then((obj) => {
                        photoIdArray.push(...obj);
                    }),
                );
            });
            Promise.all(promises).then(() => {
                // GET ALL JSON PHOTO SFROM UNSPLASH
                this.getPhotoJSON(photoIdArray);
            });
        });
        return 'All JSON should start downloading in the /photos folder';
    }

    static getPhotoJSON(photoList) {
        const promises = [];
        photoList.forEach((photoID, index) => {
            setTimeout(() => {
                promises.push(
                    axios
                        .get(`${requestURL}photos/${photoID}/`, {
                            method: 'get',
                            url: requestURL,
                            headers: {
                                Authorization: `Client-ID ${process.env.UNSPLASH_applicationId}`,
                            },
                            params: {
                                id: photoID,
                            },
                        })
                        .then((json) => {
                            jsonfile.writeFile(
                                `${folder}photos/${fileNameStub}${photoID}.json`,
                                json.data,
                                (err) => {
                                    if (err) console.error(err);
                                },
                            );
                        })
                        .catch(err => `Something wrong: ${err}`),
                );
            }, 1000 * index);
        });
        Promise.all(promises).then(() => {
            // GET ALL JSON PHOTO SFROM UNSPLASH
            console.log('All JSON should be downloaded in the /photos folder');
        });
    }

    static readPhotoIDs(theFile) {
        const idArray = [];

        return new Promise((resolve, reject) => {
            jsonfile
                .readFile(folder + theFile)
                .then((obj) => {
                    obj.forEach((photo) => {
                        idArray.push(photo.id);
                    });
                    resolve(idArray);
                })
                .catch(error => reject(error));
        });
    }

    static readFileNames(subfolder) {
        const fileArray = [];

        return new Promise((resolve, reject) => {
            fs.readdir(folder + subfolder, (err, files) => {
                files.forEach((file) => {
                    fileArray.push(file);
                });

                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }

    static getPhotoListAxios(currentCount = 1) {
        console.log(`start: ${currentCount}`);

        // Parameters for request
        const page = currentCount;
        const orderBy = 'latest';
        const perPage = 30;

        axios
            .get(`${requestURL}photos/`, {
                method: 'get',
                url: requestURL,
                headers: { Authorization: `Client-ID ${process.env.UNSPLASH_applicationId}` },
                params: {
                    page,
                    orderBy,
                    perPage,
                },
            })
            .then((json) => {
                // console.log(json.data[0]);
                // console.log(json.headers);
                // SAVE TO DISC
                jsonfile.writeFile(
                    `${folder}${fileNameStub}${currentCount}.json`,
                    json.data,
                    (err) => {
                        if (err) console.error(err);
                    },
                );
                this.loopDownload(currentCount);
                // Interesting x-headers
                // "x-total": "118442",
                // "x-ratelimit-limit": "5000",
                // "x-ratelimit-remaining": "4997",
            })
            .catch(err => `Something wrong: ${err}`);

        return 'axios request has been sent';
    }

    static loopDownload(currentCount) {
        if (maxLoop > currentCount) {
            currentCount += 1;
            this.getPhotoListAxios(currentCount);
        }

        return 'done';
    }

    static getPhotoList() {
        const page = 1;
        const orderBy = 'oldest';
        const perPage = 30;

        unsplash.photos
            .listPhotos(page, perPage, orderBy)
            .then(toJson)
            .then((json) => {
                // console.log(json[0]);
                // console.log(json.headers);
                // SAVE TO DISC
                jsonfile.writeFile(`${folder}test.json`, json, (err) => {
                    if (err) console.error(err);
                });
            })
            .catch((err) => {
                console.log(`error: ${err}`);
            });

        return 'Might have worked...';
    }

    static getRandomPhotoJson() {
        const data = { featured: 'true', width: 2400, query: 'weather' };
        unsplash.photos
            .getRandomPhoto(data)
            .then(toJson)
            .then((json) => {
                // console.log(json.urls.regular);
                // SAVE TO DISC
                jsonfile.writeFile(`${folder}test.json`, json, (err) => {
                    if (err) console.error(err);
                });
            })
            .catch((err) => {
                console.log(`error: ${err}`);
            });

        return 'Might have worked...';
    }
}

module.exports = UnsplashHelper;
