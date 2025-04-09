const express = require('express')
const router = express()

const apiVisited = require('../../model/statistics/apiVisit')

/**
 * api 访问次数统计
 */
router.get('/getApiVisited', async (req, res) => {
  let resData = {}
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

/**
 * 24小时内 api 访问次数统计
 */
router.get('/get24HoursApiVisited', async(req, res) => {
  const resData = {}
  const now = new Date()
  let before24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  try {
    let data = await apiVisited.find({visitTime : {$gte: before24Hours, $lte: now}})
    resData.status = 200
    resData.apiRecord = data
    resData.count = data.length
    res.json(resData)
  } catch (error) {
    resData.message = error
    res.json(resData)
  }
})

module.exports = router
