import { Schema, model } from "mongoose";

const AccountSchema = new Schema({
    selectServer: {type: String, required: true},
    accountLvl: {type: Number, required: true},
    accountMoney: {type: String, required: true},
    accountSecurity: {type: String, required: true},
    accountPrice: {type: String, required: true},
    userContact: {type: String, required: true},
    addInfo: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User"},
},
    {timestamps: true}
)  

const Account = model("Account", AccountSchema)

export default Account;
