const {Schema,model}=require("mongoose")

const UserSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  role: {
    type: String,
    default: "customer",
    enum: ["customer","employee","admin","user","superadmin"]
  },
  username:{
      type:String,
      require:true
  },
  password:{
      type:String,
      require:true
  }
});

module.exports=model("User",UserSchema)