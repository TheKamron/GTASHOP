import { Schema, model } from "mongoose";

const PubMoneySchema = new Schema({
    server: {type: String, required: true},
    productTitle: {type: String, required: true},
    owner: {type: String, required: true},
    priceMoney: {type: Number, required: true},
    amountMoney: {type: Number, required: true},
    minimumAmount: {type: Number, required: true},
    serverImage: {type: String, required: true},
    userContact: {type: String, required: true},
    avatar: {type: String, required: true},
    date: {type: String, required: true}
}, {timestamps: true})


const PublishMoney = model('PublishMoney', PubMoneySchema)
export default PublishMoney;