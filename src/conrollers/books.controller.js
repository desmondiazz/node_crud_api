const Book = require('../models/books.model');
const { v4: uuid } = require('uuid');
const moment = require('moment');
const createError = require('http-errors');

exports.addBook = async(req,res,next)=>{
    try {
        if(!req.body.name || !req.body.authorName){
            return res.status(400).json(createError(400,'name and authorName is required'));
        }
        const releaseDate = moment(req.body.releaseDate || moment()).valueOf();
        const book = new Book({
            uuid: uuid(),
            name:req.body.name,
            releaseDate: releaseDate,
            authorName: req.body.authorName,
            createdAt:moment().valueOf()
        });
        book.save()
        res.json({result:book})
    } catch (error) {
        next(error)
    }
}

exports.updateBook = async(req,res,next)=>{
    try {
        if(!req.params.uuid){
            return res.status(400).json(createError(400,'uuid is required'));
        }
        const book = await Book.findOne({uuid:req.params.uuid,status:1});
        if(!book){
            return res.status(400).json(createError(400,'Book not found'));
        }
        const allowed_params = ['name','authorName','releaseDate'];
        allowed_params.forEach(param=>{
            if(req.body[param]){
                if(param == 'releaseDate'){
                    book[param] = moment(req.body[param]).valueOf();
                } else {
                    book[param] = req.body[param];
                }
            }
        });
        book['updatedAt'] = moment().valueOf();

        await book.save();
        res.json({result:book})
    } catch (error) {
        next(error)
    }
}

exports.getAll = async(req,res,next)=>{
    try {
        const limit = parseInt((req.body.limit) ? req.body.limit : 10);
        let page= parseInt((req.body.page) ? req.body.page : 0) * limit;
        const books = await Book.aggregate()
        .match({status:1})
        .sort({_id:-1})
        .project({_id:0,__v:0})
        .skip(page)
        .limit(limit);
        res.json({result:books})
    } catch (error) {
        next(error)
    }
}

exports.getBookById = async(req,res,nex)=>{
    try {
        if(!req.params.uuid){
            return res.status(400).json(createError(400,'uuid is required'));       
        }
        const book = await Book.findOne({uuid:req.params.uuid,status:1},{_id:0,__v:0});
        if(!book){
            return res.status(400).json(createError(400,'Book not found'));
        }
        res.json({result:book})
    } catch (error) {
        next(error);
    }
}

exports.deleteBook = async(req,res,nex)=>{
    try {
        if(!req.params.uuid){
            return res.status(400).json(createError(400,'uuid is required'));       
        }
        const book = await Book.findOne({uuid:req.params.uuid,status:1});
        if(!book){
            return res.status(400).json(createError(400,'Book not found'));
        }
        book['status'] = 0;
        await book.save();
        res.json({result:'Success.'})
    } catch (error) {
        next(error);
    }
}