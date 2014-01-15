express   = require 'express'
everyauth = require 'everyauth'
partials  = require 'express-partials'
fs        = require 'fs'

#app = express()

#poet    = require('poet')( app )

exports.boot = (app) ->
  #Poet    = require('poet')
  #poet = Poet( app )
  #poet.init().then ->
   #    console.log "hi"
  poet    = require('poet')( app )
  app.configure ()->
    poet.init()
     
    app.set 'views', __dirname + './../views'

    app.set 'view engine', 'jade'

    app.use express.bodyParser()

    app.use express.methodOverride()
    
    app.use( poet.middleware() )

    app.use (req,res,next) ->
      res.header("X-powered-by", "Sharks")
      next()

    app.use require('connect-less')(
      src: __dirname + './../public/'
      compress: true
      yuicompress: true
    )

    app.use require('./coffee-compile')(
      force: true
      src: __dirname + './../public'
      streamOut: true
    )

    app.use express.compress()

    app.use express.static __dirname + './../public'

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

    app.use everyauth.middleware()

    # Helpers
    (require '../lib/helpers').boot app

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
    
    app.get "/post/:post", (req, res) ->
        post = req.poet.getPost(req.params.post)
        if post
          res.render "post",
              post: post
        else
            res.send 404
            
    app.get "/tag/:tag", (req, res) ->
      taggedPosts = req.poet.postsWithTag(req.params.tag)
      if taggedPosts.length
        res.render "tag",
          posts: taggedPosts
          tag: req.params.tag


    app.get "/category/:category", (req, res) ->
      categorizedPosts = req.poet.postsWithCategory(req.params.category)
      if categorizedPosts.length
        res.render "category",
          posts: categorizedPosts
          category: req.params.category

    app.get "/page/:page", (req, res) ->
      page = req.params.page
      lastPost = page * 3
      res.render "page",
        posts: req.poet.getPosts(lastPost - 3, lastPost)
        page: page


  try
    gitHead = fs.readFileSync(__dirname+'/../.git/refs/remotes/origin/master', 'utf-8').trim()
    app.set 'revision', gitHead
  catch e
    app.set 'revision', 'r'+(new Date()).getTime()


