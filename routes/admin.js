const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken')

var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        // Preserve the file extension
        const fileExtension = file.originalname.split('.').pop();
        // Generate a unique filename
        const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + fileExtension;
        cb(null, uniqueFilename);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'));
        }
    }
});


const planController = require('../Controller/planController');
const enrollmetnController = require('../Controller/enrollmentController')
const userController = require('../Controller/userController')
const adminController = require('../Controller/adminController')


// admin -----------------------------

// router.post('/postadmin',adminController.postadmin);
router.post('/postsignin',adminController.postsignin);
router.get('/getadmin',verifyToken,adminController.getAdmin);

// plans------

router.post('/postPlan',verifyToken,planController.postPlan)
router.get('/getplans',verifyToken,planController.getPlans)
router.get('/getplansbyid/:id',verifyToken,planController.getPlansById)
router.put('/putplans/:id',verifyToken,planController.putPlans)
router.delete('/deleteplan/:id',verifyToken,planController.deletePlansById)

// enrollment------

// router.post('/postenrollment',enrollmetnController.postEnrollment)
router.get('/getenrollment',verifyToken,enrollmetnController.getEnrollment)
router.get('/getenrollmentbyid/:id',enrollmetnController.getEnrollmentById)
router.put('/putenrollment/:id',enrollmetnController.putEnrollment)

// users-----------------
router.post('/postuser',upload.single('image'),userController.postUser)
router.post('/postusersignin',userController.userPostSignIn)
router.get('/getusers',verifyToken,userController.getUser)
router.get('/getuserbyid/:id',userController.getUserById)
router.delete('/deleteuser/:id',userController.deleteUser)
router.put('/edituser/:id',upload.single('image'),userController.editUser)

module.exports = router;