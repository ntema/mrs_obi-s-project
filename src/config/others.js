const Vendor = require("../../models/Vendor");
const Joi = require("joi");
const consolelog = require("../../utils/consolelog");
const axios = require("axios");
const { PAYSTACK_AUTHORIZATION_TOKEN } = require("../../configs/constants");
const redisClient = require("../../configs/redisa");
module.exports = async function (req, res, next) {
  try {
    const { error, value } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    const _id = req.user._id;
    const {body}=req
    const vendorExists= await Vendor.findOne({
        
        $or: [
          { businessEmail:body.businessEmail }, 
          { user: _id },
          { businessPhone:body.businessPhone }, 
        ]
    })
    
    if(vendorExists){
      return res.status(400).json({error: { 
          message:"Vendor details has already been used" 
        }
      });
    }
    const amount= 3500
    
    const initialRes= await axios.post('https://api.paystack.co/transaction/initialize',
    {
      email:body.businessEmail,amount:amount*100
    }    
    ,{
      headers:{
        Authorization:PAYSTACK_AUTHORIZATION_TOKEN
      }
    })
    // consolelog({initialRes})
    const {data}=initialRes
    if(!data){
    return res.status(400).json({error: {
          message:"something went wrong with the initial deposit for now" 
        }
      });
    }
    // consolelog({data})
    const preTransaction = new Transaction({
      amount,
      mode:"transfer", 
      callbackApiPath:'auth/vendor',
      user:_id, 
      reason:"vendor's initial payment of 3500",
      reference: data.data.reference,
      authorizationUrl:data.data.authorization_url
    });
    const transaction= await preTransaction.save()
    
    //store vendor info in redis
    redisClient.set(`wannabe-vendor/${_id}`, 
        JSON.stringify({
            businessName: body.businessName,
            businessEmail: body.businessEmail,
            businessPhone: body.businessPhone,
            user:_id
        })
    )
    return res.status(200).json({status:"success",transaction });
  } catch (error) {
    next(error);
  }
};