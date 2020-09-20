const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  comments:[
    { type: String }
  ]
},
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: truie
    }
  });

BookSchema.virtual('commentcount').get(function() {
  if(this.comments) {
    return this.comments.length;
  }
});

// Hide __v field from JSON
// Ref: https://stackoverflow.com/a/17063594/1420506
BookSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.__v;
    return ret;
  }
});

const BookModel = mongoose.model('Book', BookSchema);

exports.BookModel = BookModel;