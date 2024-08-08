const { getToken } = require("../generateToken");
const axios = require('axios');
const AppError = require("../utils/AppError");
const catchAsync = require("./../utils/catchAsync");

// Fetch function to get properties for a specific page
async function fetchProperties(url, token) {
    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            // timeout: 10000 // 10 seconds
        });

        return response.data;  // Return the response data directly
    } catch (error) {
        console.error('Fetch error:', error.message);
        throw error;
    }
}

exports.getProperties = catchAsync(async (req, res, next) => {
    try {
        const token = await getToken();
        console.log(token);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const url = `https://ddfapi.realtor.ca/odata/v1/Property?$filter=City eq 'Vancouver'&$top=${pageSize}&$skip=${(page - 1) * pageSize}`;

        const response = await fetchProperties(url, token);


        // Return the properties and the next link if available
        return res.status(200).json({
            properties: response.value,
            // nextLink: response['@odata.nextLink'] || null
        });
    } catch (error) {
        console.error('Server error:', error.message);
        console.log();
        return res.status(500).json({ message: 'An error occurred while fetching properties.', error });
    }
});
exports.getLocations = catchAsync(async (req, res, next) => {
    try {
        const token = getToken();



        const url = `https://ddfapi.realtor.ca/odata/v1/Property?$filter=City eq 'Vancouver'&$select=Latitude,Longitude`;

        const response = await fetchProperties(url, token);


        // Return the properties and the next link if available
        return res.status(200).json({
            properties: response.value,
            // nextLink: response['@odata.nextLink'] || null
        });
    } catch (error) {
        console.error('Server error:', error.message);
        return res.status(500).json({ message: 'An error occurred while fetching properties.' });
    }
});

exports.getProperty = catchAsync(async (req, res, next) => {
    try {
        const token = getToken();
        const response = await axios.get(`https://ddfapi.realtor.ca/odata/v1/Property/${req.params.listingKey}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        // const data = {
        //     ListingKey: response.ListingKey,
        //     LotSizeArea: response.LotSizeArea,
        //     LotSizeUnits: response.LotSizeUnits,
        //     PropertySubType: response.PropertySubType,
        //     BedroomsTotal: response.BedroomsTotal,
        //     OriginalEntryTimestamp: response.OriginalEntryTimestamp,
        //     BathroomsTotalInteger: response.BathroomsTotalInteger,
        //     PublicRemarks: response.PublicRemarks,
        //     ListPrice: response.ListPrice,
        //     ListingURL: response.ListingURL,
        //     PhotosCount: response.PhotosCount,
        //     UnparsedAddress: response.UnparsedAddress,
        //     PostalCode: response.PostalCode,
        //     PostalCode: response.PostalCode,
        //     StateOrProvince: response.StateOrProvince,
        //     coordinates: [response.Latitude, response.Longitude],
        //     YearBuilt: response.YearBuilt,
        //     ArchitecturalStyle: response.ArchitecturalStyle,
        //     Media: response.Media,


        // }

        return res.status(200).json(response.data)
    } catch (error) {
        console.log(error);
        if (error.status === 400)
            return next(new AppError("Not found", 404))
        return next(new AppError("Internal server error", 500))

    }
})