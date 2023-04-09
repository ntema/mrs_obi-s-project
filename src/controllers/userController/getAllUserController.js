
const User = require('../../models/UserSchema')


const getAllUserController = async(req,res) => { 
    try {
        const user = await User.find({})
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



module.exports = getAllUserController