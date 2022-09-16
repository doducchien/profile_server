const connection = require('./src/config/db');
const { default: axios } = require("axios");
const API_URL = 'https://api.gologin.com'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjYzMWU1ZTk1ODNkNWVlNDk5OGNiNDQ4MCIsInR5cGUiOiJ1c2VyIiwic3ViIjoiNjMxZTVlOTM4M2Q1ZWU0MzQ1Y2I0NDdiIn0.ah5MlReOss2swIzZOA8i0ey3DhduXwZeqcA4h0sAEqs'
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Authorization': `Bearer ${token}`
    }
})

const randomName = require('random-name')

const delay = async (senconds)=> new Promise((resolve, reject)=>{
    return setTimeout(resolve, senconds * 1000)
})

const paramFingerprint = [
    {
        os: 'lin'
    },
    {
        os: 'win'
    },
    {
        os: 'win'
    },
    {
        os: 'win'
    },
    {
        os: 'win'
    },
    {
        os: 'win'
    },
    {
        os: 'mac',
        isM1: 'yes'
    },
    {
        os: 'mac'
    }
]

async function fetchExtension() {
    const res = await api.get('/extensions/extension_list');
    return res.data;
}

async function saveExtensionToDb(name, extId, type) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO extensions(name, ext_id, type) VALUE(?,?,?)'
        connection.query(sql, [name, extId, type], function (err, result) {
            if (err) {
                console.log(err);
                return reject(err)
            }
            resolve(result)
        })
    })
}


async function fetchNewFingerprint() {
    const param = paramFingerprint[Math.floor(Math.random() * 8)]
    const search = new URLSearchParams(param)
    const res = await api.get(`/browser/fingerprint?${search}`);
    return{
        ...res.data,
        isM1: param?.isM1 ? true : false
    }
}
async function saveExtension() {
    const extensions = await fetchExtension();
    const total = 0;
    extensions.map(async (item, idx) => {
        const { name, extId, type } = item;
        try {
            await saveExtensionToDb(name, extId, type)
            console.log('inserted ' + idx)
            total += 1;
        }
        catch (err) {
            console.log('wrong insert')
        }
    })
    console.log(`DONE, total extension: ${total}`)
}
// saveExtension()

// fetchNewFingerprint()
// createProfile()



async function createProfileBody() {
    const newFingerprint = await fetchNewFingerprint();
    const chromeExtensions = [];
    for(let i = 0; i < Math.floor(Math.random() * 10); i++){
        const extId = (await getRandomChromeExtension()).ext_id;
        chromeExtensions.push(extId)
    }
    const body = {
        ...newFingerprint,
        "name": randomName(),
        "proxyEnabled": false,
        "googleClientId": "744164548.1662934661",
        "googleServicesEnabled": false,
        "startUrl": "https://iphey.com",
        "lockEnabled": false,
        "debugMode": false,
        "dns": "",
        "proxy": {
            "mode": "none",
            "host": "",
            "port": 80,
            "username": "",
            "password": "",
            "autoProxyRegion": "us",
            "torProxyRegion": "us"
        },
        "timezone": {
            "enabled": true,
            "fillBasedOnIp": true,
            "timezone": ""
        },
        "browserType": "chrome",
        "chromeExtensions": chromeExtensions,
        "geolocation": {
            "mode": "prompt",
            "enabled": true,
            "fillBasedOnIp": true,
            "customize": true,
            "latitude": 0,
            "longitude": 0,
            "accuracy": 10
        },
        "webRTC": {
            "mode": "alerted",
            "enabled": true,
            "fillBasedOnIp": true,
            "localIpMasking": true,
            "publicIp": "",
            "customize": true,
            "localIps": []
        },
        "clientRects": {
            "mode": "noise"
        },
        "audioContext": {
            "mode": "noise"
        },
        fonts: {
            "enableMasking": true,
            "enableDomRect": true,
            families: newFingerprint.fonts
        },
        mediaDevices: {
            enableMasking: true,
            ...newFingerprint.mediaDevices,

        },
        "extensions": {
            "enabled": true,
            "preloadCustom": true,
            "names": []
        },
        "storage": {
            "local": true,
            "extensions": true,
            "bookmarks": true,
            "history": true,
            "passwords": true,
            "session": true
        },
        "plugins": {
            "enableVulnerable": true,
            "enableFlash": true
        },
        "cookies": [],
        "chromeExtensionsToAllProfiles": [],
        "userChromeExtensions": [],

    }
    body.webGLMetadata.mode = 'mask'


    return body;
}

const getExtension = async(randomId)=>{
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM extensions WHERE id = ?'
        connection.query(sql, [randomId], function(err, result){
            if (err) {
                console.log(err);
                return reject(err)
            }
            resolve(result)
        })
    })
}
async function getRandomChromeExtension(){
    const randomId = Math.floor(Math.random() * 2500)
    const extension = await getExtension(randomId);
    return extension[0]
}

async function createProfile() {
    let total = 0;
    for (i = 0; i < 4000; i++) {
        try {
            const profileBody = await createProfileBody();
            await api.post('/browser', profileBody);
            console.log('create profile success: ' + i);
            total += 1;
        } catch (error) {
            // console.log(error?.response?.data?.message[0]?.children)
            console.log('Create profile failure: ' + i)
        }
        // await delay(1);
    }
    console.log("DONE, total profile: " + total)

}

createProfile()