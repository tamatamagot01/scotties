"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressValidation = void 0;
const addressValidation = (req, res, next) => {
    const { phoneNumber, streetAddress, subDistrict, district, province, postalCode, } = req.body;
    // phone-number validation
    const newPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (newPhone.length !== 10) {
        res.status(400).json({ error: "Invalid phone number format!", newPhone });
        return;
    }
    // street-address, sub-district, district, province validation
    if (streetAddress === "" ||
        subDistrict === "" ||
        district === "" ||
        province === "") {
        res.status(400).json({
            error: "All input fields are required!",
            streetAddress,
            subDistrict,
            district,
            province,
        });
        return;
    }
    // postal-code validation
    if (postalCode.length !== 5) {
        res.status(400).json({ error: "Invalid postal code!", postalCode });
        return;
    }
    next();
};
exports.addressValidation = addressValidation;
