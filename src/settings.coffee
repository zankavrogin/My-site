express   = require 'express'
lessMiddleware = require 'less-middleware'
partials  = require 'express-partials'
fs        = require 'fs'
poet = require("poet")


exports.boot = (app) -> 
  console.log("7")
  poet = poet(app,
    posts: "./_posts/"
    postsPerPage: 5
    metaFormat: "json"
  )
  
  app.configure ()->
    
    poet.init().then ->
     
    app.set 'views', __dirname + './../views'

    app.set 'view engine', 'jade'
    
    
    console.log("8")
    app.use express.json()
    app.use express.urlencoded()

    app.use express.methodOverride()
    

    app.use (req,res,next) ->
      res.header("X-powered-by", "Sharks")
      next()
    
    app.use lessMiddleware(
      src: __dirname + './../public'
      compress: true
    )
    
    app.use express.static __dirname + './../public'
    
    app.use require('./coffee-compile')(
      force: true
      src: __dirname + './../public'
      streamOut: true
    )

    app.use express.compress()


    app.use express.cookieParser 'detta-är-en-hemlighet'

    #app.use express.session(
      #secret: '43894d20bec9d6fb9e5e6ebae119e20c33feec50'
      #cookie:
        #domain: app.config.DOMAIN
      #domain: app.config.DOMAIN
      #httpOnly: true
      # 5 days
      #maxAge: 1000*60*60*24*5
    #)
    
    console.log("9")

    # Helpers
    (require './lib/helpers').boot app

    # load the express-partials middleware
    app.use partials()

    app.use express.favicon()
    app.use app.router

    



  app.set 'showStackError', false


  # app.configure 'development', ()->
  #   app.use express.errorHandler
  #     dumpExceptions: true
  #     showStack: true


  app.configure 'staging', ()->
    app.enable 'view cache'


  app.configure 'production', ()->
    app.enable 'view cache'
  
  console.log("10")
    



