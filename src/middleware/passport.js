
export const isAuthenticated = (req, res, next) => {
  console.log('auth', req.isAuthenticated);
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({
        error: 'Необходимо авторизоваться',
        status: "error"
      })
    }
    next()
  }
  