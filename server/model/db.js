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

//引入数据库相应的 schema
const userSchema = require('../schema/user')

const Models = {
  userModel: mongoose.model("user", userSchema, "user"),
};

module.exports = Models;
