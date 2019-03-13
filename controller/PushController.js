const push = require('web-push')
const HTTPErrors = require('../lib/HTTPErrors')
const pushKeys = {
  public: 'BDRe_PCCye4-n3Xcqpdad1O7U-g-XIqW7bdM_YpmRmHHH6-xFqi9-_OHypXtP7I7fFASiC5ucKyAsdkLfL7X_0k',
  private: 'MMhEgpJnGbnacd7ZBjl0jRPXBAjnaV5ZrQc1xGSUGVI'
}

push.setVapidDetails(
  'https://1dv612-client.nidawi.me',
  pushKeys.public,
  pushKeys.private
)

module.exports.sendPush = async (subscription, data) => {
  if (!subscription) {
    throw new HTTPErrors.BadRequestError('No subscription provided')
  }

  const subObj = parseJSON(subscription)
  if (!subObj) {
    throw new HTTPErrors.BadRequestError('Invalid subscription provided')
  }

  const props = Object.getOwnPropertyNames(data)
  if (props.indexOf('title') < 0 || props.indexOf('body') < 0) {
    throw new HTTPErrors.BadRequestError('Required parameter(s) missing')
  }

  try {
    const result = await push.sendNotification(subObj, JSON.stringify({ title: data.title, body: data.body, icon: data.icon || undefined }))
    return (200 - result.statusCode < 100)
  } catch (err) {
    throw new HTTPErrors.BadRequestError('Notification Failed: check input.')
  }
}

const parseJSON = json => {
  try {
    return JSON.parse(json)
  } catch (err) { return undefined }
}
