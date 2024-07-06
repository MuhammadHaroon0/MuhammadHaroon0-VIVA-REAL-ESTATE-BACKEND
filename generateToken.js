const axios = require('axios');
const AppError = require("./utils/AppError");
const catchAsync = require("./utils/catchAsync");

let apiToken;
const fetchToken = catchAsync(async (req, res, next) => {
    try {

        const response = await axios.post('https://identity.crea.ca/connect/token',
            {
                client_id: process.env.CLIENT_USERNAME,
                client_secret: process.env.CLIENT_PASSWORD,
                grant_type: "client_credentials",
                scope: "DDFApi_Read"
            }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        );
        apiToken = response.data.access_token;

        console.log(apiToken);
    } catch (error) {
        return new AppError("Failed to refresh token", 500)  //400 for bad request
    }
})


const getToken = () => {
    if (!apiToken || Date.now() >= apiToken.expires_in) {
        // Token is expired or not available, fetch a new one
        fetchToken();
    }
    return apiToken;
}

module.exports = {
    getToken, fetchToken
}