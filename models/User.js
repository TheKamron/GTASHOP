import {Schema, model} from "mongoose"

const UserSchema = new Schema({
    userName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}, 
    role: {type: String},
    avatar: {type: String}
}, {timestamps: true})

const User = model("User", UserSchema)
export default User;