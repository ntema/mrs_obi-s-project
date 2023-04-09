const User = require('../../models/UserSchema')
const updateUserController=  async(req,res) => { 
    try {
        let {body} = req
        const update = await User.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: body },
        { new:true})
        if(update) {
            return res.status(200).json(update)
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error)
    }
}

module.exports = updateUserController