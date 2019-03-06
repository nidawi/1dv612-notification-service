// Server config for express and its modules.

const express = require('express')
const bodyParser = require('body-parser')
const plugins = require('./plugins')
const security = require('./security')
const HTTPErrors = require('../lib/HTTPErrors')
const apiConfig = require('./apiconfig')

const http = require('http')
const app = express()
const server = http.createServer(app)

/**
 * Set-up for express.
 */
const createApp = () => {
  // By default, responses are in JSON. Only supported content-type as of now.
  app.use((req, res, next) => {
    res
      .type(apiConfig.contentType)
      .set('X-Content-Type-Options', apiConfig.contentTypeOptions)
      .set('Cache-Control', apiConfig.cacheDefault)

    next()
  })

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.use(plugins.helmetConfig)
  app.use((req, res, next) => {
    // Verify Method
    if (apiConfig.acceptedMethods.indexOf(req.method) < 0) return next(new HTTPErrors.MethodNotAllowed('Bad Method: Not Allowed'))
    // Verify Content-Type (We only respond using status codes)
    // if (!(apiConfig.acceptedContentTypes.some(a => req.headers['accept'].indexOf(a) > -1))) return next(new HTTPErrors.Unacceptable('Expected Content Type: Unacceptable'))
    // Verify Content Type
    if ((['POST'].indexOf(req.method) > -1) && (req.headers['content-type'] !== apiConfig.contentType)) return next(new HTTPErrors.Unacceptable('Bad Content Type: Unacceptable'))

    return next()
  })

  // Create & Apply security measures to route.
  app.use('/send', security, require('../routes/send'))

  // Invalid route / Error
  app.use((req, res, next) => next(new HTTPErrors.NotFoundError()))
  app.use((err, req, res, next) => translateError(err, req, res))

  return app
}

const translateError = (err, req, res) => {
  // Errors use a special envelope.
  const outputEnvelope = {
    code: 500,
    message: 'An unknown error has occured. Please try again later.',
    links: [
      { rel: 'self', method: req.method, href: req.originalUrl }
    ]
  }

  if (err instanceof HTTPErrors.GenericApplicationError || err instanceof SyntaxError) {
    switch (true) {
      case err instanceof SyntaxError:
        outputEnvelope.code = err.statusCode
        outputEnvelope.message = 'Invalid JSON provided. Please check your input and try again.'
        break
      case err instanceof HTTPErrors.NotFoundError:
        outputEnvelope.code = err.code
        outputEnvelope.message = err.message || 'Resource Could Not Be Found'
        break
      default:
        outputEnvelope.code = err.code || 500
        outputEnvelope.message = err.message || `Error ${err.code || 500} - ${err.constructor.name}`
    }
  }

  console.log(err)
  res.status(outputEnvelope.code).send(JSON.stringify(outputEnvelope))
}

/**
 * Set-up for server and socket.
*/
const createServer = () => {
  createApp()
  return server
}

module.exports = {
  createServer: createServer,
  refs: {
    server: server
  }
}
