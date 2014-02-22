express = require("express")
app      = express()
port     = process.env.PORT or 8080
mongoose = require 'mongoose'
settings = require './settings'
errors   = require './lib/error-handler'

mongoose.connection.on 'open', ()->
  
  # Configuration
  settings.boot(app)

  # Error Handler
  errors.boot(app)

  # Bootstrap models
  app.models = {}
  model_loc = __dirname + '/models'
  model_files = (require 'fs').readdirSync model_loc
  model_files.forEach (file) ->
    (require model_loc + '/' + file).boot(app)
  
  
  # Bootstrap controllers
  controller_loc = __dirname + '/controllers'
  controller_files = (require 'fs').readdirSync controller_loc
  controller_files.forEach (file) ->
    (require controller_loc + '/' + file)(app)
    

 
  errors.setup404(app)


  # Start the app by listening on <port>
  server = app.listen port
  console.log "Express-Boilerplate started on port #{port}"

#mongoose.connect app.config.MONGOHQ_URL||'mongodb://localhost/test'mongoose.connect "mongodb://127.0.0.1/test"

mongoose.connect process.env.MONGOHQ_URL


