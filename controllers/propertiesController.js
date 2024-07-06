const { getToken } = require("../generateToken");
const axios = require('axios');
const AppError = require("../utils/AppError");
const catchAsync = require("./../utils/catchAsync");
exports.getProperties = catchAsync(async (req, res, next) => {
    try {
        const token = getToken();
        const response = await axios.get("https://ddfapi.realtor.ca/odata/v1/Property?$filter=City eq 'Vancouver'", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        return res.status(200).json(response.data.value)
    } catch (error) {
        console.log(error);

    }
})
exports.getProperty = catchAsync(async (req, res, next) => {
    try {
        const token = getToken();
        console.log("ass");
        const response = await axios.get(`https://ddfapi.realtor.ca/odata/v1/Property/${req.params.listingKey}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        console.log(response.data);
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
        // console.log(data);
        return res.status(200).json(response.data)
    } catch (error) {
        console.log(error);
        if (error.status === 400)
            return next(new AppError("Not found", 404))
        return next(new AppError("Internal server error", 500))

    }
})
