import { Schema, model } from "mongoose";

const PublishSchema = new Schema({
    server: {type: String, required: true},
    productTitle: {type: String, required: true},
    owner: {type: String, required: true},
    contactUser: {type: String, required: true},
    price: {type: String, required: true},
    userAvatar: {type: String,},
    serverImage: {type: String, required: true},
    date: {type: String, required: true},
    addInfo: {type: String, required: true},
}, {timestamps: true} )


const Publish = model("Publish", PublishSchema)

export default Publish;