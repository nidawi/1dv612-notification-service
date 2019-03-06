const MailService = require('./MailService')

class Gmail extends MailService {
  /**
   * Creates an instance of Gmail.
   * @param {mailInputData} mailData
   * @memberof Gmail
   */
  constructor (mailData) {
    super(Object.assign(mailData, {
      sender: process.env.transporterAccounts.gmail.user
    }))
    this.createTransporter('gmail', process.env.transporterAccounts.gmail)
  }
}

module.exports = Gmail

/**
 * @typedef {object} mailInputData
 * @property {string} recipient
 * @property {string} subject
 * @property {string} body
 */
