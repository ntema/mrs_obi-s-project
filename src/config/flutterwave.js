const axios = require("axios");

const flutterwave = (req, res) => {
  try {
    //flutterwave api config
    const MySecretKey = `FLWSECK-39f3e9e851b91068fc45aa9e1014afc1-X`;

    const create_virtual_wallet = async(user_data) => {
      
var mydata = JSON.stringify({
  email: "developers@flutterwavego.com",
  is_permanent: true,
  bvn: "12345678901",
  tx_ref: "VA12",
  phonenumber: "08109328188",
  firstname: "Angela",
  lastname: "Ashley",
  narration: "Angela Ashley-Osuzoka",
});

var config = {
  method: "post",
  url: "https://api.flutterwave.com/v3/virtual-account-numbers",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${MySecretKey}`,
  },
  data: user_data,
};

const data = axios(config);
return data;
    }
    const create_user_subaccount = async (user_data) => {
      const url = "https://api.flutterwave.com/v3/payout-subaccounts";
      const options = {
        headers: {
          Authorization: MySecretKey,
        },
      };
      const data = await axios.post(url, user_data, options);
      return data;
    };


    const initializeWithdrawal = async (user_data) => {
      const url = "https://api.flutterwave.com/v3/transfers";
      const options = {
        headers: {
          Authorization: MySecretKey,
        },
      };
      const data = await axios.post(url, user_data, options);
      return data;
    };


     const verify_transaction = async (id) => {
       const url = `https://api.flutterwave.com/v3/transactions/${id}/verify`;
       const options = {
         headers: {
           Authorization: MySecretKey,
         },
       };
       const data = await axios.get(url, options);
       return data;
     };


    const retry_failed_Withdrawal = async (user_data, id) => {
      const url = `https://api.flutterwave.com/v3/transfers/${id}/retries`;
      const options = {
        headers: {
          Authorization: MySecretKey,
        },
      };
      const data = await axios.post(url, user_data, options);
      return data;
    };


        const resend_failed_webhook = async (user_data, id) => {
          const url = `https://api.flutterwave.com/v3/transactions/${id}/resend-hook`;
          const options = {
            headers: {
              Authorization: MySecretKey,
            },
          };
          const data = await axios.post(url, user_data, options);
          return data;
        };


         const resolve_account_details = async (user_data) => {
           const url = `https://api.flutterwave.com/v3/accounts/resolve`;
           const options = {
             headers: {
               Authorization: MySecretKey,
             },
           };
           const data = await axios.post(url, user_data, options);
           return data;
         };


     const fetch_retry_withdrawal = async (id) => {
       const url = `https://api.flutterwave.com/v3/transfers/${id}/retries`;
       const options = {
         headers: {
           Authorization: MySecretKey,
         },
       };
       const data = await axios.get(url, options);
       return data;
     };

     
     const fetch_all_withdrawal = async() => {
       const url = `https://api.flutterwave.com/v3/transfers`;
       const options = {
         headers: {
           Authorization: MySecretKey,
         },
       };
       const data = await axios.get(url, options);
       return data;
     };


      const fetch_single_withdrawal = async (id) => {
        const url = `https://api.flutterwave.com/v3/transfers/${id}`
        const options = {
          headers: {
            Authorization: MySecretKey,
          },
        };
        const data = await axios.get(url, options);
        return data;
      };


    const fetch_user_subaccount = async (account_reference) => {
      const url =
        "https://api.flutterwave.com/v3/payout-subaccounts/" +
        encodeURIComponent(account_reference);
      const options = {
        headers: {
          Authorization: MySecretKey,
        },
      };
      const data = await axios.get(url, options);
      return data;
    };


     const verify_bvn = async (bvn) => {
       const url =
         `https://api.flutterwave.com/v3/kyc/bvns/${bvn}` ;
        const options = {
         headers: {
           Authorization: MySecretKey,
         },
       };
       const data = await axios.get(url, options);
       return data;
     };
    


    const fetch_transaction_from_user_subaccount = async (account_reference) => {
      const url =
        `https://api.flutterwave.com/v3/payout-subaccounts/${account_reference}/transactions`;
      const options = {
        headers: {
          Authorization: MySecretKey,
        },
      };
      const data = await axios.get(url, options);
      return data;
    };


     const fetch_account_balance_from_user_subaccount = async (account_reference) => {
      const url = `https://api.flutterwave.com/v3/payout-subaccounts/${account_reference}/balances`;
      const options = {
        headers: {
          Authorization: MySecretKey,
        },
      };
      const data = await axios.get(url, options);
      return data;
    };


      const generate_account_details_for_user_subaccount = async (account_reference) => {
        const url = `https://api.flutterwave.com/v3/payout-subaccounts/${account_reference}/static-account`;
        const options = {
          headers: {
            Authorization: MySecretKey,
          },
        };
        const data = await axios.get(url, options);
        return data;
      };


       const loading_transaction_timeline = async (id) => {
         const url = `https://api.flutterwave.com/v3/transactions/${id}/events`;
         const options = {
           headers: {
             Authorization: MySecretKey,
           },
         };
         const data = await axios.get(url, options);
         return data;
       };


    const resolveAccount = async (referenceID) => {
      const url =
        `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}/` +
        encodeURIComponent(referenceID);
      const options = {
        headers: {
          Authorization: MySecretKey,
        },
      };
      const data = await axios.get(url, options);
      return data;
    };


    const listBanks = async (referenceID) => {
      const url = `https://api.paystack.co/bank/`;
      const options = {
        headers: {
          Authorization: MySecretKey,
        },
      };
      const data = await axios.get(url, options);
      return data;
    };
    
    return {
      create_virtual_wallet,
        verify_bvn,
      initializeWithdrawal,
      loading_transaction_timeline,
      fetch_single_withdrawal,
      retry_failed_Withdrawal,
      fetch_user_subaccount,
      create_user_subaccount,
      fetch_transaction_from_user_subaccount,
      fetch_account_balance_from_user_subaccount,
      generate_account_details_for_user_subaccount,
      resolveAccount,
      listBanks,
      fetch_all_withdrawal,
      fetch_retry_withdrawal,
      verify_transaction,
      resend_failed_webhook,
      resolve_account_details,
    };
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
};
module.exports = flutterwave;
