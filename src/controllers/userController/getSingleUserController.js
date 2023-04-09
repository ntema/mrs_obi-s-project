
const User = require('../../models/UserSchema')


const getSingleUserController = async(req,res) => { 
    try {
        const user = await User.findOne({_id:req.user._id})
        if(user){
            return res.status(200).json(user)
    }else{
        return res.status(400).json('no user found')
    }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error)
    }
}
module.exports = getSingleUserController