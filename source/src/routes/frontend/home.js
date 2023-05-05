
const express = require('express')
const router = express.Router()

const loginFrontEndMiddleware = require('../../middleware/login_frontend')

const HomeController = require(`${__path_controllers}frontend/home_controller`)

 
router
    .route('/')
    .get(HomeController.ListHome)

router
    .route('/product')
    .get(HomeController.ListProduct)

router
    .route('/blog')
    .get(HomeController.ListBlog) 

router
    .route('/view_product/:id')
    .get(HomeController.ListProductDetail)

router
    .route('/dang-nhap')
    .get(HomeController.ListLogin)

router
    .route('/dang-ky')
    .get(HomeController.ListSignup)

router
    .route('/dang-ky/ma-kich-hoat')
    .post(HomeController.ListCheckCode)     

router
    .route('/blogs(/:slug)?')
    .get(HomeController.ListBlogDetail)
    
router
    .route('/ve-chung-toi')
    .get(HomeController.ListIntroduce)
    
router
    .route('/the-hoi-vien')
    .get(HomeController.ListMembership) 
    
router
    .route('/chinh-sach-doi-tra')
    .get(HomeController.ListPolicy)
    
router
    .route('/thanh-toan')
    .get(loginFrontEndMiddleware, HomeController.CheckOut) 

router
    .route('/don-hang(/:action)?')
    .get(loginFrontEndMiddleware, HomeController.Invoice)

router
    .route('/contact')
    .post(HomeController.Contact)

router
    .route('/:slug')
    .get(HomeController.ListSlug)


module.exports = router;