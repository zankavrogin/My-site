(function() {
  var Schema, UserSchema, app, crypto, express, mongoose;

  express = require("express");

  app = express();

  crypto = require('ezcrypto').Crypto;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  console.log("11");

  UserSchema = new Schema({
    email: {
      type: String,
      index: true
    },
    hashPassword: {
      type: String,
      index: true
    },
    firstName: String,
    lastName: String,
    friends: [
      {
        type: Schema.ObjectId,
        ref: 'User'
      }
    ],
    loginCount: {
      type: Number,
      "default": 0
    },
    lastLogin: {
      type: Date,
      "default": Date.now
    },
    modified: {
      type: Date,
      "default": Date.now
    },
    admin: {
      type: Boolean,
      "default": false
    }
  });

  UserSchema.set('toJSON', {
    virtuals: true
  });

  UserSchema.set('toObject', {
    virtuals: true
  });

  UserSchema.virtual('password').get(function() {
    return this._password;
  }).set(function(pass) {
    this.setPassword(pass);
    return this._password = pass;
  });

  UserSchema.virtual('id').get(function() {
    return this._id.toHexString();
  });

  UserSchema.virtual('name').get(function() {
    return ("" + this.firstName + " " + this.lastName).trim();
  }).set(function(fullName) {
    var p;
    p = fullName.split(' ');
    this.firstName = p[0];
    return this.lastName = p[1];
  });

  exports.UserSchema = module.exports.UserSchema = UserSchema;

  exports.boot = module.exports.boot = function(app) {};

  mongoose.model('User', UserSchema);

  console.log("13");

}).call(this);
