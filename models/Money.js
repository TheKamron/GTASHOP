import { Schema, model } from "mongoose";

const MoneySchema = new Schema({
    selectServer: {type: String, required: true},
    priceMoney: {type: Number, required: true},
    amountMoney: {type: Number, required: true},
    minimumAmount: {type: Number, required: true},
    userContact: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User"},
}, 
    {timestamps: true}
)

const Money = model("Money", MoneySchema)

export default Money;


