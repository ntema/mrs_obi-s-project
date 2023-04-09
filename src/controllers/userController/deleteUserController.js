const User = require('../../models/UserSchema')
const deleteUserController = async(req,res) => { 
    try {
            const userFound = await User.findById(req.user._id)
             if(userFound){
             await User.findByIdAndDelete(req.user._id)
             return res.status(200).json(`user deleted`)
      }else{
        res.status(401).json('user not found')
     }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error)
    }
}

module.exports = deleteUserController 