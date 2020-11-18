
function checkAuthAdmin(req, res, next) {
  if (req.authUser.auth.includes('admin')) {
    return next();
  }else{
    return res.status(401).json({ status: false, error: 'Unauthorized, request admin priviledge' });
  }
}
module.exports = checkAuthAdmin;