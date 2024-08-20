import { Schema, model } from "mongoose";

const ContactSchema = new Schema({
    email: {type: String, unique: false, required: true},
    subject: {type: String, required: true},
    message: {type: String, required: true}
})

const Contact = model("Contact", ContactSchema)
export default Contact;