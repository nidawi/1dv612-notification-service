const nodemailer = require('nodemailer')

/**
 * @abstract
 */
class MailService {
  constructor (mailData) {
    this.setRecipient(mailData.recipient)
    this.setSubject(mailData.subject)
    this.setBody(mailData.body)

    this._sender = mailData.sender
    this._transporter = undefined
  }

  setRecipient (value) {
    if (!value) throw new Error('Bad Mail Recipient: Missing')
    else if (typeof value !== 'string') throw new Error('Bad Mail Recipient: Input Type')
    else if (value.length < 2) throw new Error(`Bad Mail Recipient: Length`)
    else if (!this._validateEmailAddress(value)) throw new Error(`Bad Mail Recipient: Invalid Address`)
    else this.recipient = value
  }
  setSubject (value) {
    if (!value) throw new Error('Bad Mail Subject: Missing')
    else if (typeof value !== 'string') throw new Error('Bad Mail Subject: Input Type')
    else if (value.length < 2 || value.length > 200) throw new Error(`Bad Mail Subject: Length`)
    else this.subject = value
  }
  setBody (value) {
    if (!value) throw new Error('Bad Mail Body: Missing')
    else if (typeof value !== 'string') throw new Error('Bad Mail Body: Input Type')
    else if (value.length < 2 || value.length > 2000) throw new Error(`Bad Mail Body: Length`)
    else this.body = value
  }

  createTransporter (service, auth) {
    this._transporter = nodemailer.createTransport({
      service: service,
      auth: auth
    })
  }

  async send () {
    try {
      await this._transporter.sendMail({
        from: this._sender,
        to: this.recipient,
        subject: this.subject,
        html: this.body
      })
      return true
    } catch (err) {
      console.log(`Mail Operation Failed: ${err}`)
      return false
    }
  }

  _validateEmailAddress (value) {
    // This is a mediocre attempt at verifying an email address
    return new RegExp(/^.*@.*\..*$/)
      .test(value)
  }
}

module.exports = MailService
