exports = module.exports = (app) ->
  # Home
  app.get '/', (req, res) ->
    res.render 'index'
    
  # Portfolio
  app.get '/work', (req, res) ->
    res.render 'work'
    
    
