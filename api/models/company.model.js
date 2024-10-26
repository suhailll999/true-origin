import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    companyEmail: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const Company = mongoose.model("company", CompanySchema);

export default Company;