const axios = require('axios');
const AppError = require("./utils/AppError");
const catchAsync = require("./utils/catchAsync");

let apiToken = null;
let tokenExpiryTime = null;

const fetchToken = catchAsync(async (req, res, next) => {
    try {
        const response = await axios.post('https://identity.crea.ca/connect/token', {
            client_id: process.env.CLIENT_USERNAME,
            client_secret: process.env.CLIENT_PASSWORD,
            grant_type: "client_credentials",
            scope: "DDFApi_Read"
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        apiToken = response.data.access_token;
        // Calculate the expiry time as current time plus the token's duration
        tokenExpiryTime = Date.now() + response.data.expires_in * 1000;
        console.log(`New token fetched: ${apiToken}`);
    } catch (error) {
        console.error("Failed to refresh token", error);
        throw new AppError("Failed to refresh token", 500);
    }
});

const getToken = async () => {
    if (!apiToken || Date.now() >= tokenExpiryTime) {
        console.log("Token expired or not available, fetching a new one...");
        await fetchToken();
    }
    return apiToken;
};

module.exports = {
    getToken,
    fetchToken
};
