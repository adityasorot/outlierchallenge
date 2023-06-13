const { default: axios } = require('axios')
const knex = require('./db')
let gradeData;
module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth(req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent(req, res, next) {
  try {
    const data = await knex('students').where('id', req.params.id)
    if (data.length === 0) {
      res.json({ success: false, error: "No data with the given id" })
      return
    }
    res.json({ success: true, data })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudentGradesReport(req, res, next) {
  try {
    const studentGrade = await knex('grades').where('id', req.params.id)
    const data = await knex('students').where('id', req.params.id)
    if (data.length === 0) {
      res.json({ success: false, error: "No data with the given id" })
      return
    }
    data[0].gradeReport = studentGrade
    res.json({ success: true, data })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getCourseGradesReport(req, res, next) {
  try {
    const data = await knex('grades')
      .select('course')
      .avg('grade as averageGrade')
      .min('grade as minGrade')
      .max('grade as maxGrade')
      .groupBy('course')
    res.json({ success: true, data })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}
