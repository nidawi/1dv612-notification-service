module.exports = {
  contentType: 'application/json',
  acceptedContentTypes: ['application/json', 'text/html'], // We accept application/json and text/html as stringified JSON is "text", sort of.
  cacheDefault: 'private,no-store,no-cache,must-revalidate,max-age=0',
  contentTypeOptions: 'nosniff',
  acceptedMethods: ['POST'],
  shouldCheckAccepted: false,
  shouldCheckMethod: true,
  shouldCheckContentType: true
}
