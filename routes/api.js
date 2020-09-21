/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MONGODB_CONNECTION_STRING = process.env.DB;

const mongoose = require('mongoose');
const connection = mongoose.connect(MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const { BookModel } = require('../models/book')

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      BookModel.aggregate([{
          $project: {
            'commentcount': {'$size': '$comments'},
            'title': 1,
            '_id': 1
          }
        }],
      (err, docs) => {
        if(err) console.log(err);
        return res.json(docs);
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;

      if(!title) {
        return res.send('missing required field title')
      }

      let book = new BookModel({ title });

      book.save((err, doc) => {
        if(err) {
          console.log(err);
          return res.send('error saving');
        }
        return res.json(doc.toJSON());
      })


    })
    
    .delete(function(req, res){
      BookModel.deleteMany({},(err, result) => {
        if(err) console.log(err)
        if(result) {
          return res.send('complete delete successful');
        }
      })

    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookId = req.params.id;

      BookModel.findOne({ _id: bookId }, (err, doc) => {
        if(err) console.log(err);

        if(doc) {
          return res.json(doc);
        } else {
          return res.send('no book exists')
        }
      });
    })
    
    .post(function(req, res){
      let bookId = req.params.id;
      let comment = req.body.comment;

      if(!comment) {
        return res.send('missing required field comment');
      }

      BookModel.findByIdAndUpdate(bookId,
        {
          $push: {
            "comments": comment
          }
        }, { lean: true, new: true },
        (err, doc,) => {
          if(err) console.log(err)
          if(doc) {
            return res.json(doc);
          }
          return res.send("no book exists");
      });
    })
    
    .delete(function(req, res){
      let bookId = req.params.id;

      BookModel.findByIdAndRemove(bookId,{},
        (err, results) => {
        if(err) console.log(err);
        if(results) {
          return res.send('delete successful');
        } else {
          return res.send('no book exists');
        }
      })
    });
  
};
