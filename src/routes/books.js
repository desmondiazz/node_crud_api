var express = require('express');
var router = express.Router();

const booksCtrl = require('../conrollers/books.controller');

router.post('/add',booksCtrl.addBook);
router.post('/get-all-books',booksCtrl.getAll);
router.get('/:uuid',booksCtrl.getBookById);
router.put('/:uuid',booksCtrl.updateBook);
router.delete('/:uuid',booksCtrl.deleteBook);

module.exports = router;
