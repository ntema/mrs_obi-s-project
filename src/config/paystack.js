const axios  = require('axios')

const paystack = (req, res) => {
  try {
    //paystack config
    const MySecretKey = `Bearer sk_test_f41c902e0875807ec12d3436f5810aed4c76d089`;
    const verifyBVN = async (user_data) => {
      const url= "https://api.paystack.co/bvn/match"
      const options = 
        {
          headers:{
            Authorization: MySecretKey
          }
        }
      const data = await axios.post(url,user_data,options)
      return data
  }
    const initializePayment = async (user_data) => {
        const url= "https://api.paystack.co/transaction/initialize"
        const options = 
          {
            headers:{
              Authorization: MySecretKey
            }
          }
        const data = await axios.post(url,user_data,options)
        return data
    }
    const verifyPayment = async ( referenceID ) => {
      const url = "https://api.paystack.co/transaction/verify/" + encodeURIComponent(referenceID)
      const options = 
      {
        headers: {
          Authorization: MySecretKey
        }
      };
        const data = await axios.get(url, options)
        return data
    }
     const resolveAccount = async ( referenceID ) => {
      const url = `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}/` + encodeURIComponent(referenceID)
      const options = 
      {
        headers: {
          Authorization: MySecretKey
        }
      };
        const data = await axios.get(url, options)
        return data
    }
    const listBanks = async ( referenceID ) => {
      const url = `https://api.paystack.co/bank/`
      const options = 
      {
        headers: {
          Authorization: MySecretKey
        }
      };
        const data = await axios.get(url, options)
        return data
    }
    return {initializePayment, verifyPayment, verifyBVN, resolveAccount,listBanks}
  } catch (e){
    res
        .status(500)
        .json({ error: { message: e.message } });
  }
}
module.exports = paystack
