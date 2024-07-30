const express = require('express')
const router = express()

const apiVisited = require('../../model/statistics/apiVisit')

let resData = {}
router.use((req, res, next) => {
  resData.status = ''
  resData.message = ''
  next()
})

router.get('/getApiVisited', async (req, res) => {
  try {
    let data = await apiVisited.countDocuments()
    resData.status = 200
    resData.count = data
    res.json(resData)
  } catch (error) {
    resData.message = error
    res.json(resData)
  }
})

module.exports = router
