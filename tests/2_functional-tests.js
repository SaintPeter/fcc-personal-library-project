/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ 'title': 'Faux Book 1' })
          .end(function(err, res){
            assert.isObject(res.body);
            assert.property(res.body,'title')
            assert.property(res.body,'_id')
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err, res){
            assert.isString(res.text);
            assert.equal(res.text, "missing required field title")
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        let a = chai.request(server)
          .post('/api/books')
          .send({ 'title': 'Faux Book A' })
        let b =  chai.request(server)
          .post('/api/books')
          .send({ 'title': 'Faux Book B' })
        let c =  chai.request(server)
          .post('/api/books')
          .send({ 'title': 'Faux Book C' })

        Promise.all([a,b,c])
          .then(() => {
            chai.request(server)
              .get('/api/books')
              .end(function(err, res){
                assert.isArray(res.body);
                assert.isAtLeast(res.body.length,3)
                res.body.forEach((book) => {
                  assert.isObject(book);
                  assert.property(book, "title")
                  assert.match(book.title, /Faux Book \w/);
                  assert.property(book, "commentcount")
                  assert.isNumber(book.commentcount);
                })
                done();
              });
          })
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        // Fake ObjectId
        chai.request(server)
          .get('/api/books/5f665eb46e296f6b9b6a504d')
          .end(function(err, res){
            assert.isString(res.  text);
            assert.equal(res.text, 'no book exists' )
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .post('/api/books')
          .send({ 'title': 'Faux Book Alpha' })
          .end(function(err, res) {
            assert.isObject(res.body);
            let bookId = res.body._id;
            chai.request(server)
              .get('/api/books/' + bookId)
              .end(function(err, res){
                assert.isObject(res.body);
                assert.property(res.body, 'title')
                assert.equal(res.body.title, 'Faux Book Alpha' )
                assert.property(res.body, 'comments')
                assert.isArray(res.body.comments)
                done();
              });
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books')
          .send({ 'title': 'Faux Book Beta' })
          .end(function(err, res) {
            assert.isObject(res.body);
            let bookId = res.body._id;
            chai.request(server)
              .post('/api/books/' + bookId)
              .send({comment: 'This book is fab!'})
              .end(function(err, res){
                assert.isObject(res.body);
                assert.property(res.body, 'comments');
                assert.isArray(res.body.comments);
                assert.include(res.body.comments, 'This book is fab!');
                done();
              });
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/5f665eb46e296f6b9b6a504d')
          .send({ comment: "This comment won't make it" })
          .end(function(err, res){
            assert.isString(res.  text);
            assert.equal(res.text, 'no book exists' )
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .post('/api/books')
          .send({ 'title': 'A Book to Delete' })
          .end(function(err, res) {
            assert.isObject(res.body);
            let bookId = res.body._id;
            chai.request(server)
              .delete('/api/books/' + bookId)
              .end(function(err, res){
                assert.isString(res.text);
                assert.equal(res.text, 'delete successful' )
                done();
              });
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/5f665eb46e296f6b9b6a504d')
          .end(function(err, res){
            assert.isString(res.  text);
            assert.equal(res.text, 'no book exists' )
            done();
          });
      });

    });

  });

});
