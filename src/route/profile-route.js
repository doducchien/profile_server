const express = require('express');
const router = express.Router();

const profileController = require('../controller/profile-controller')


router.get('/', function(req, res){
    return profileController.getProfiles(req, res); 
})

router.get('/:profileId', function(req, res){
    return profileController.getProfileDetail(req, res)
})

router.get('/collect-id', function(req, res){
    return profileController.collectProfilesIdAndSaveToFile(req, res)
})
router.get('/collect-data', function(req, res){
    return profileController.collectProfilesToDatabase(req, res)
})


module.exports = router;