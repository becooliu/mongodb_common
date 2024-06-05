const mongoose = require("mongoose");

// const userSchema2 = require("./schema");

/* const DBURL = 'mongodb:127.0.0.1:27017/common'
mongoose.connect(DBURL).then(res => {
    console.log('恭喜，连接成功。')
}).catch(err => {
    console.error('连接失败')
}) */

//连接数据库
mongoose.connect("mongodb://127.0.0.1:27017/common");

//为连接绑定事件
const db = mongoose.connection;
db.once("error", () => console.log("database connect error."));
db.once("open", () => console.log("Mongo connect success ."));

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: Number,
    sex: {
      type: String,
      default: "未知",
    },
  },
  {
    versionKey: false,
  }
);

const Models = {
  userModel: mongoose.model("user", userSchema, "user"),
};

module.exports = Models;
