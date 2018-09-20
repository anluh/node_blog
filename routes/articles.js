const express = require('express');
const router = express.Router();
const path = require('path');

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


let Article = require('../models/article');
let User = require('../models/user');


/* GET add a new post page. */
router.get("/add", ensureAuthenticated, (req, res)=> {
  res.render('add_article', {
    title: "Add Article"
  })
});

// Init multer

const multer = require('multer');

// Set Storage Engine
const storage = multer.diskStorage({
  destination: './public/images/articles',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb)
  }
}).single('image');

// Check File Type

function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }

}

router.post("/add", jsonParser, (req, res, next) =>{
  upload(req, res, (err) => {
    if(err){
      req.flash('danger', err);
      res.render('add_article', {
        title: "Add Article"
      })
    } else {
      next();
    }
  })
}, (req, res)=>{
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  let article = new Article();
  article.title = req.body.title;
  article.author = req.user._id;
  article.body = req.body.body;

  // Get Errors

  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      title: 'Add Article',
      errors: errors,
      article: article
    })
  } else {

    if(req.file) {
      article.image = req.file.filename;
    } else {
      article.image = '';
    }

    console.log(path);

    article.save((err) => {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });


  }

});

// === Edit Article ===

router.get('/edit/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if(article.author != req.user._id) {
      req.flash('danger','No Authorized');
      res.redirect('/')
    }
    res.render('article_edit', {article: article});
  });

});


router.post("/edit/:id", ensureAuthenticated, (req, res)=>{
  let id = req.params.id;
  let article = {};
  article.title = req.body.title;
  article.body = req.body.body;

  console.log(req.params);

  let query = {_id: id};

  Article.update(query, article, (err) => {
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success','Article Changed');
      res.redirect('/articles/' +id);
    }
  });

});

// == Delete article ==
router.delete('/:id', ensureAuthenticated, function(req, res){
  if(!req.user._id){
    res.status(500).send()
  }

  let query = {_id: req.params.id};

  Article.findById(query, (err, article) => {
    if(err){
      console.log(err)
    } else {
      if(req.user._id != article.author){
        res.status(500).send();
      } else {
        Article.remove(query, function(err){
          if(err){
            console.log(err)
          } else {
            res.send('Success')
          }
        })
      }
    }
  });


});

/* GET single article. */
router.get('/:id', function(req, res) {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err){
      console.log(err);
    } else {
      User.findById(article.author, (err, user) => {
        if(err){
          console.log(err)
        } else {
          res.render('article', {
            title: "Single Article",
            article: article,
            author: user.username
          })
        }
      });

    }
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;