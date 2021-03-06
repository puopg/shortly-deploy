var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var linkSchema = new mongoose.Schema({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: {type: Number, default: 0}
});

mongoose.model('Link', linkSchema);

//The callback function creates the code for the shortened link by
//hashing the link's url.
//Function executes before link instance is saved.
linkSchema.pre('save', function(next) {
   var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
    next();
  }
);

var Link = mongoose.model('Link');
/*
var Link = db.Model.extend({
  tableName: 'urls',
  hasTimestamps: true,
  defaults: {
    visits: 0
  },
  initialize: function(){
    this.on('creating', function(model, attrs, options){
      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      model.set('code', shasum.digest('hex').slice(0, 5));
    });
  }
});
*/
module.exports = Link;
