(function() {
  var Schema, UserSchema, crypto, mongoose;

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

  UserSchema.method('encryptPassword', function(plainText) {
    return crypto.MD5(plainText || '');
  });

  UserSchema.method('setPassword', function(plainText) {
    this.hashPassword = this.encryptPassword(plainText);
    return this;
  });

  UserSchema.method('authenticate', function(plainText) {
    return this.hashPassword === this.encryptPassword(plainText);
  });

  UserSchema.method('isPasswordless', function() {
    var _ref;
    return !((_ref = this.hashPassword) != null ? _ref.length : void 0);
  });

  UserSchema.pre('save', function(next) {
    this.modified = Date.now();
    if (this.isPasswordless()) {
      return next(Error('No password specified'));
    } else {
      return next();
    }
  });

  console.log("12");

  exports.UserSchema = module.exports.UserSchema = UserSchema;

  exports.boot = module.exports.boot = function(app) {
    mongoose.model('User', UserSchema);
    return app.models.User = mongoose.model('User');
  };

  console.log("13");

}).call(this);
