const verifyToken = require('../authMiddleware/verifyToken')
const verifyUserAndAdmin = (req, res, next) => {
    verifyToken(req, res, () =>{
        if(req.user.id === req.params.id || ['admin'].includes(req.user.role)){
            next()
        }else{
            res.status(400).json({error:{message:'Access denied, Not authorized.'}})
        }
    })
}

module.exports = verifyUserAndAdmin