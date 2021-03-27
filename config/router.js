
var express = require('express');
var router = express.Router();

var indexRouter = require('../src/routes/index');
var booksRouter = require('../src/routes/books');

router.use('/books',booksRouter);
router.use('/',indexRouter);

module.exports = router