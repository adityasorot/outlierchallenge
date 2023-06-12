const { default: axios } = require('axios')
const knex = require('./db')
let gradeData;
module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

const functionLoadup = async function() {
  if(gradeData) return
  gradeData = await axios.get('https://outlier-coding-test-data.onrender.com/grades.json')
}

functionLoadup()

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
    await functionLoadup()
    const studentGrade = gradeData.data.find(grades => grades.id === Number(req.params.id))
    const data = await knex('students').where('id', req.params.id)
    if (data.length === 0) {
      res.json({ success: false, error: "No data with the given id" })
      return
    }
    data[0].course = studentGrade.course
    data[0].grade = studentGrade.grade
    res.json({ success: true, data })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getCourseGradesReport(req, res, next) {
  try {
    await functionLoadup()
    const data = {}
    gradeData.data.forEach((grade) => {
      if (data[grade.course] === undefined) {
        data[grade.course] = {
          max: 0,
          min: 100,
          count: 0,
          sum: 0,
          average: 0
        }
      }
      if (data[grade.course].max < grade.grade) data[grade.course].max = grade.grade
      if (data[grade.course].min > grade.grade) data[grade.course].min = grade.grade
      data[grade.course].count += 1
      data[grade.course].sum += grade.grade
      data[grade.course].average = data[grade.course].sum / data[grade.course].count
    })
    Object.keys(data).forEach((course) => {
      delete data[course].count
      delete data[course].sum
    })
    res.json({ success: true, data })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}
