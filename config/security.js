const jwt = require('../lib/jwt')
const HTTPErrors = require('../lib/HTTPErrors')

const verifyToken = authorization => {
  if (!authorization || typeof authorization !== 'string') throw new HTTPErrors.UnauthorizedError('Bad Authentication: Token Missing')
  else if (authorization.indexOf('Bearer') === -1) throw new HTTPErrors.BadRequestError('Bad Authentication: Wrong Method')

  const token = authorization.replace(/Bearer /, '')
  const payload = jwt.verify(token)

  if (!payload) throw new HTTPErrors.UnauthorizedError('Bad Authentication: Invalid Token')
  return payload
}

module.exports = (req, res, next) => {
  try {
    req.jwt = verifyToken(req.headers.authorization)
    next()
  } catch (err) {
    next(err)
  }
}
