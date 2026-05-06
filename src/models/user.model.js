import mongoose from "mongoose";
const {Schema} = mongoose;
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee"
  },
  refreshToken:{
    type: String
  }
}, { timestamps: true });


userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) throw next();
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        id: this._id,
        fullname: this.fullname,
        email: this.email
    },
    process.env.ACCESSTOKEN_SECRET,
    {
        expiresIn: process.env.ACCESSTOKEN_EXPIRE
    }
)
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign({
        id: this._id
    },
    process.env.REFRESHTOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_EXPIRE
    }
)
}


export const User = mongoose.model("User", userSchema)