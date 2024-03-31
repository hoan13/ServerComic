const db = require("./db");
const AdminSchema = new db.mongoose.Schema(
  {
    avatar: { type: String },
    fullname: { type: String },
    email: { type: String },
    password: { type: String },
  },
  { collection: "AdminModel" }
);
const AdminModel = db.model("AdminModel", AdminSchema);
module.exports = { AdminModel };
