var moment = require('moment');
var validUrl = require('valid-url');
var Url = require('../app/models/url');
var multer = require('multer');
var upload = multer({
    dest: './public/uploads',
    limits: {
        files: 1,
        fields: 1,
        fileSize: 10000
    }, // Limit Uploads to a few image types
    fileFilter: function fileFilter(req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            req.multerImageValidation = 'just images please';
            return cb(null, false);
        }
        return cb(null, true);
    }
}).single('upload');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index.ejs'); // Render index.ejs
    });

    /************************* TIME SERVICE  *************************/
    app.get('/timeservice', function(req, res) {
        res.render('timeservice.ejs');
    });

    app.get('/timeservice/:date', function(req, res) { // get url input
        var date = new Date(req.params.date);
        if (moment(date).isValid()) {
            return res.json({
                'unix': moment(date).unix(),
                'natural': moment(date).format('MMMM D, YYYY')
            });
        } else {
            var naturalDate = moment(moment.unix(req.params.date));
            return res.json({
                'unix': req.params.date,
                'natural': naturalDate.format('MMMM D, YYYY')
            });
        }
        return res.json({
            'unix': null,
            'natural': null
        });
    });

    /************************* WHO AM I  *************************/
    app.get('/whoami', function(req, res) {
        return res.json({
            'ip': req.ip,
            'language': req.headers['accept-language'],
            software: req.headers['user-agent']
        });
    });

    /************************* URL Shortner Service *************************/
    app.get('/urlsh', function(req, res) {
        res.render('urlsh');
    });

    // Shorten a new url
    app.get('/urlsh/new/:url*', function(req, res) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var relevantUrl = fullUrl.split('new')[0];
        if (validUrl.isUri(req.params.url + req.params[0])) {
            // First check if the url is arleady in the DB, no need to add it again
            Url.findOne({
                'originalUrl': req.params.url + req.params[0]
            }, function(err, result) {
                if (err) {
                    console.log(err);
                    return res.json({
                        Error: 'Oooops! Something went wrong!'
                    });
                }
                if (!result) {
                    // No result so we add the new one
                    var newUrl = new Url();
                    newUrl.originalUrl = req.params.url + req.params[0];
                    newUrl.save(function(err, foo) {
                        if (err) {
                            console.log(err);
                            return res.json({
                                Error: 'Oooops! Something went wrong!'
                            });
                        }
                        return res.json({
                            original_url: foo.originalUrl,
                            short_url: relevantUrl + foo.id
                        });
                    });
                } else {
                    // Link found so display the info from the DB
                    return res.json({
                        original_url: result.originalUrl,
                        short_url: relevantUrl + result._id
                    });
                }
            });
        } else {
            return res.json({
                Error: 'That\'s not a valid url!'
            });
        }
    });

    // Use the shor url
    app.get('/urlsh/:id', function(req, res) {
        Url.findOne({
            '_id': req.params.id
        }, function(err, result) {
            if (err) {
                return res.json({
                    Error: 'Oooops! Something went wrong!'
                });
            }
            if (!result) {
                return res.json({
                    Error: 'Url id not found!'
                });
            }
            return res.redirect(result.originalUrl);
        });
    });

    /************************* File Metadata Microservice *************************/
    app.get('/fileservice', function(req, res) {
        res.render('fileservice');
    });

    app.post('/uploadfile', function(req, res, next) {
        upload(req, res, function(err) {
            if (err) {
                console.log(err);
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.json({
                        reply: 'fileSize'
                    });
                }
                return res.json({
                    reply: 'failed'
                });
            }
            if (req.multerImageValidation) {
                return res.json({
                    reply: 'wrongType'
                });
            } else {
                return res.json({
                    reply: 'success',
                    fileSize: req.file.size
                });
            }
        });
    });
};
