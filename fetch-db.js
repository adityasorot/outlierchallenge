const fs = require('fs')
const request = require('request')
const { default: axios } = require('axios')
console.log('Fetching students.db...')
async function getGrades() {
    const knex = require('./db')
    await knex.schema.createTable('grades', function (table) {
        table.integer('id');
        table.string('course');
        table.integer('grade');
    })
    const gradeData = await axios.get('https://outlier-coding-test-data.onrender.com/grades.json')
    const datalist = gradeData.data
    for (let i = 0; i < datalist.length; i += 1000) {
        await knex('grades').insert(gradeData.data.slice(i, i + 10))
    }
    console.log('finished')
    process.exit()
}
request('https://outlier-coding-test-data.onrender.com/students.db')
    .pipe(fs.createWriteStream('students.db'))
    .on('finish', getGrades)