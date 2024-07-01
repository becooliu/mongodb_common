"use strict";
const express = require("express");
const app = express();

const api = require("./api/user/index");

const models = require('./model/db')

const bodyParser = require("body-parser");
//解析 application/json
app.use(bodyParser.json());
//解析 application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const path = require("path");
// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件时，直接将__dirname + "../public/Uploads/images" 下的资源返回
app.use(express.static(path.resolve(__dirname, "../public/Uploads/images")));

//允许跨域访问 方法1：
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["PUT,POST,GET,DELETE,OPTIONS"],
    credentials: true, // 是否允许带上cookie 信息
    allowedHeaders: "Content-Type",
  })
);

//允许跨域访问 方法2：

/* app.use("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if (req.method === 'OPTIONS') {
      res.send(200)
    } else {
      next()
    }
  }); */

  app.use((req, res, next) => {
    
    const userInfoCookieArr = req.headers.cookie.match(new RegExp("(^| )" + 'userInfo' + "=([^;]*)(;|$)"))
    if(userInfoCookieArr?.length) {
      try {
        const userInfo = JSON.parse(unescape(userInfoCookieArr[2]))

        //获取当前登录用户是否为管理员
        models.login.findById(userInfo._id).then(user => {
         req.userInfo.isAdmin = Boolean(user?.isAdmin)
         next()
        })
      
      } catch (error) {
        next()
      }
    }else {
      next()

    }
    
  })

app.use(api);


const port = 8088;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
