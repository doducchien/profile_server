const axiosInstance = require('../config/axios-config');
const connection = require('../config/db')
const fs = require('fs')
const readline = require('readline')
const profileRepository = require('../repository/profile-repository')

async function fetchProfileId(page, limit = 30) {
    const query = new URLSearchParams({ page, limit }).toString();
    try {
        const res = await axiosInstance.get(`/browser/v2?${query}`)
        return (res?.data?.profiles || []).map(item => item.id)
    } catch (error) {
        console.log(error)
        return [];
    }
}

async function fetchProfile(profileId) {
    try {
        const res = await axiosInstance.get(`/browser/${profileId}`)
        return res?.data
    } catch (error) {
        console.log(error)
        return null;
    }
}

function saveListToFile(file, listId) {
    (listId || []).forEach(id => file.write(id + '\n'));
}
async function delay(timeout) {
    let delay_ = setTimeout(() => {
        clearTimeout(delay_)
    }, timeout)
    return delay_;
}

async function collectId(){
    const profileId_file = fs.createWriteStream('./resource/profile_id.txt', { flags: 'a' })

    for (let i = 1; i < 23; i++) {
        console.log(`Start call api with i = ${i}`);
        const listProfile = await fetchProfileId(i);
        console.log(`Call api with i = ${i} success`);

        saveListToFile(profileId_file, listProfile)
        await delay(2000)
    }
    profileId_file.close();
    console.log(profileId_file.path);
}

async function collectProfilesIdAndSaveToFile(req, res) {
    collectId();
    res.json({
        message: "Profile ids are being collected, complete soon!",
        data: ''
    })
}

async function collectData() {
    const profileId_file = fs.createReadStream('./resource/profile_id.txt', {})
    const rl = readline.createInterface({
        input: profileId_file,
        crlfDelay: Infinity
    });
    let i = 0;
    let dataInsert = []
    for await (const line of rl) {
        const data = await fetchProfile(line);
        dataInsert.push([line, JSON.stringify(data)])
        if(i % 2 == 0 && i > 0){
            profileRepository.saveMultipleProfiles(dataInsert)
            i = 0;
            dataInsert = [];
        }
        else i++;
    }
    rl.close()
    profileId_file.close()
}
async function collectProfilesToDatabase(req, res) {
    collectData();
    res.json({
        message: "Profile datas are being collected, complete soon!",
        data: ''
    })
}
async function getProfiles(req, res){
    const {page, size} = req.query;
    const result = {
        totalRow: 0,
        totalPage: 0,
        listItem: []
    }

    const [totalRow, profiles] = await Promise.all([
        profileRepository.getTotalProfiles(),
        profileRepository.getProfiles(Number(page), Number(size))
    ])


    result.totalRow = totalRow;
    result.totalPage =Math.ceil(totalRow / Number(size));
    result.listItem = profiles.map(item => {
        return {
            ...item,
            data: JSON.parse(item.data)
        }
    });
    res.json({
        message: 'success',
        data: result
    })
   
}

async function getProfileDetail(req, res){
    const profileId = req.params.profileId;
    const profile = await profileRepository.getProfileById(profileId);
    res.json({
        message: 'ok',
        data: {
            ...profile,
            data: JSON.parse(profile.data)
        }
    })
}
module.exports = {
    collectProfilesIdAndSaveToFile,
    collectProfilesToDatabase,
    getProfiles,
    getProfileDetail
}