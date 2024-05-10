const axios = require('axios');

setInterval(async () => {
    try{
        const updatedToekn = await axios.post('https://webexapis.com/v1/access_token', {
        grant_type: 'refresh_token',
        client_id: `${process.env.WxCC_CLIENT_ID}`,
        client_secret: `${process.env.WxCC_CLIENT_SECRET}`,
        refresh_token: `${loginDetails.refresh_token}`
        })
        console.log(`Updated Token: ${JSON.stringify(updatedToekn.data)}`);
    }
    catch (error){
        console.log(`Error while refreshing token: ${error}`);
    }
}, 39600000);