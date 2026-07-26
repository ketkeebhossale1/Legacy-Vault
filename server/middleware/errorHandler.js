export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(error)
  const isDev = process.env.NODE_ENV !== 'production'
  res.status(500).json({
    success: false,
    message: isDev ? error.message : 'Internal server error',
    data: null,
  })
}
