const connection = require('../config/db');


async function saveMultipleProfiles(data) {
    const sql = 'INSERT INTO profiles(id, data) VALUES ?';

    connection.query(sql, [data], function (err, values) {
        if (err) {
            console.log(err)
            return false;
        }
        return true
    })

}

function getTotalProfiles() {
    const sql = 'SELECT COUNT(*) as total FROM profiles';
    let total;
    return new Promise((resolve, reject) => {
        connection.query(sql, [], function (err, values) {
            if (err) {
                console.log(err)
                return reject(err)
            }
            const [result] = values;
            resolve(result.total);
            
        })
    })
}

async function getProfiles(page, size) {
    const sql = `SELECT * FROM profiles
        LIMIT ? OFFSET ?
    `
    return new Promise((resolve, reject)=>{
        connection.query(sql, [size, page * size], function (err, values) {
            if (err) {
                console.log(err)
                return reject(err);
            }
            resolve(values)
        })
    })

}

async function getProfileById(id){
    const sql = 'SELECT * FROM profiles WHERE id = ?';
    return new Promise((resolve, reject)=>{
        connection.query(sql, [id], function(err, values){
            if(err){
                console.log(err);
                return reject(err)
            }
            resolve(values[0]);
        })
    })
}

module.exports = { saveMultipleProfiles, getTotalProfiles, getProfiles, getProfileById };