const mongoose = require("mongoose");

// const userSchema2 = require("./schema");

/* const DBURL = 'mongodb:127.0.0.1:27017/common'
mongoose.connect(DBURL).then(res => {
    console.log('恭喜，连接成功。')
}).catch(err => {
    console.error('连接失败')
}) */



//引入数据库相应的 schema
const userSchema = require('../schema/user')
const rolesSchema = require('../schema/roles')

const Models = {
  userModel: mongoose.model("user", userSchema, "user"),
  rolesModel: mongoose.model('roles', rolesSchema, 'roles')
};

module.exports = Models;
