const HTTPErrors = require('../lib/HTTPErrors')
const Gmail = require('../model/Gmail')
// Other services here

const _getMailService = (service, mailData) => {
  try {
    switch (service) {
      case 'gmail':
        return new Gmail(mailData)
      default:
        throw new HTTPErrors.NotFoundError('Mail Service Does Not Exist')
    }
  } catch (err) {
    throw new HTTPErrors.BadRequestError(err.message)
  }
}

module.exports.sendMessage = async (method, mailData) => {
  const selectedService = _getMailService(method, mailData)
  const success = await selectedService.send()
  if (!success) {
    throw new HTTPErrors.InternalError('Notification Failed')
  }
}
