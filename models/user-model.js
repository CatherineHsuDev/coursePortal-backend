const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

// 同sql定義每一個欄位的資料型態

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// instance method, 創建每一個item可用
userSchema.methods.isStudent = function () {
  return this.role == "student";
};
userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

userSchema.methods.comparePassword = async function (password, cb) {
  // password是user輸入的string, this.password是hash過的string，比對有沒有一樣

  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

// mongoose middlewares
// if the person is a new signup user, or user is changing pwd, hash the password
// 儲存前檢查使用者身分或狀態，是新註冊或正在更改密碼
userSchema.pre("save", async function (next) {
  // 要使用this的話，要用function(next)，不能用()=>
  // ()=>不能使用this
  // this指的是mongodb內的documentent
  if (this.isNew || this.isModified("password")) {
    // hash pwd, hash 10 rounds
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
