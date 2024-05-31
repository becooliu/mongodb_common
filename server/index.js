const express = require('express')
const app = express()

const api = require('./api/user/addUser')


const bodyParser = require('body-parser')
//解析 application/json
app.use(bodyParser.json())
//解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

const path = require('path')
// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
app.use(express.static(path.resolve(__dirname, '../public/Uploads/images')));


//允许跨域访问 方法1：
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['PUT,POST,GET,DELETE,OPTIONS'],
  credentials: true, // 是否允许带上cookie 信息
  allowedHeaders: 'Content-Type'
}))


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

  app.use(api)

  const port = 8088
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
