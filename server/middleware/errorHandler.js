export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(error)
  res.status(500).json({ success: false, message: 'Internal server error', data: null })
}
