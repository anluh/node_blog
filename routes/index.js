var express = require('express');
var router = express.Router();

let Article = require('../models/article');

/* GET home page. */
router.get('/', function(req, res) {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
        res.render('index', {
            title: 'Articles',
            articles: articles
        });
    }

  });
});


// == Test page ==

router.get('/tests', function(req, res) {
    res.render('tests', { title: 'Tests'});
});

// =====================  Emmit =======================


const Logger = require('./logger');
const logger = new Logger();

logger.on('messageLogged', (arg) => {
  console.log('Listener called', arg);
});

// logger.log('message');

// =====================  http =======================


module.exports = router;

