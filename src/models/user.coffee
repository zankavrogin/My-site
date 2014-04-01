express = require("express")
app      = express()
crypto = require('ezcrypto').Crypto
mongoose = require('mongoose')
Schema = mongoose.Schema
console.log("11")
# Schema Setup
UserSchema = new Schema(
  email:
    type: String
    index: true
  hashPassword:
    type: String
    index: true
  firstName: String
  lastName: String
  friends: [
    type: Schema.ObjectId
    ref: 'User'
  ]
  loginCount:
    type: Number
    default: 0
  lastLogin:
    type: Date
    default: Date.now
  modified:
    type: Date
    default: Date.now
  admin:
    type: Boolean
    default: false
)


UserSchema.set 'toJSON', virtuals: true
UserSchema.set 'toObject', virtuals: true


UserSchema.virtual('password')
  .get( () -> this._password )
  .set( (pass) ->
    @.setPassword(pass)
    @._password = pass
  )

UserSchema.virtual('id')
  .get( () -> this._id.toHexString() )

UserSchema.virtual('name')
  .get( () -> "#{@.firstName} #{@.lastName}".trim() )
  .set( (fullName) ->
    p = fullName.split ' '
    @.firstName = p[0]
    @.lastName = p[1]
  )


# Exports
exports.UserSchema = module.exports.UserSchema = UserSchema
exports.boot = module.exports.boot = (app) ->
mongoose.model 'User', UserSchema
console.log("13")

