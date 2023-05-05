const express = require('express')

const router = express.Router()
const phiVanChuyenController = require(`${__path_controllers}backend/phiVanChuyen_controller`)
const { validate } = require(`${__path_validator}item`);


router
    .route('(/status/:status)?')
    .get(phiVanChuyenController.getlist)

router
    .route('/form(/:id)?')
    .get(phiVanChuyenController.getForm)
    .post(phiVanChuyenController.saveItem)

router
    .route('/change-status/:id/:status')
    .get(phiVanChuyenController.getStatus)

// router
//     .route('/change-number/:id/:number/:collection')
//     .get(phiVanChuyenController.getNumber)    

// router
//     .route('/delete/:id')
//     .get(phiVanChuyenController.deleteItem)

router
    .route('/sotien/:value')
    .get(phiVanChuyenController.soTien)
    
router
    .route('/multipleAction')
    .post(phiVanChuyenController.changeMultipleAction)

router
    .route('/sort/:sort_field/:sort_type')
    .get(phiVanChuyenController.getSort)    



module.exports = router;