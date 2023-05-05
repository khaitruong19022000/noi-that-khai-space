const routerName = 'home';
const renderName = `frontend/page/${routerName}`;

const ramdomstring = require('randomstring')
const nodemailer =  require('nodemailer');

const paramsHelpers = require(`${__path_helpers}params`)
const nodemailerHelpers   = require(`${__path_helpers}nodemailer`)
const ContactModel = require(`${__path_models}contact_model`)
const HomeService = require(`${__path_services}frontend/home_service`);
const SettingService = require(`${__path_services}backend/setting_service`);

module.exports = {
    ListHome: async (req , res , next) => {
        let { data_slider } =   await HomeService.ListSlider()
        let { data_product_special } =   await HomeService.listProductSpecial()
        let { data_product_show_home } =   await HomeService.listProductShowHome()
        let { data_blog_show_home } =   await HomeService.listBlogShowHome()

        res.render('frontend/page/home' , {
            data_product_special,
            data_product_show_home,
            data_blog_show_home,
            data_slider
        })
    },

    ListProduct: async (req , res , next) => {

        let search   = paramsHelpers.getParam(req.query, 'search', '')

        let condition = {}
        if(search !== '') condition = {name: {$regex: search, $options: 'i'}}

        let pagination = {
            totalItem       : 1,
            totalItemPerPage: 16,
            currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
            pageRange       : 3
        }


        let { categoryProductItems } =   await HomeService.findAllCategoryProduct()

        let arrIdCategory = []
        categoryProductItems.forEach(value => {
            arrIdCategory.push(value.id)
        })

        condition.status = "active"
        condition.id_category = { $in: arrIdCategory }
        
        let { data_product } =   await HomeService.ListProduct({condition, pagination})
        let slug = ''

        res.render('frontend/page/product', {
            data_product,
            pagination,
            slug,
            search
        })
        
    },

    ListProductDetail: async (req , res , next) => {
        let id            = await paramsHelpers.getParam(req.params, 'id', '')

        let { data_product_detail } =   await HomeService.findOneProduct({id})

        res.render('frontend/page/view_product',{
            data: data_product_detail
        })
    },

    ListBlog: async (req , res , next) => {
        let condition = {}

        let pagination = {
            totalItem       : 1,
            totalItemPerPage: 4,
            currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
            pageRange       : 3
        }


        let { categoryItems } =   await HomeService.findAllCategory()

        let arrIdCategory = []
        categoryItems.forEach(value => {
            arrIdCategory.push(value.id)
        })

        condition.status = "active"
        condition.id_category = { $in: arrIdCategory }
        
        let pageTitle = ''
        
        let { data_blog } =   await HomeService.ListBlog({condition, pagination})
        let slug = ''

        res.render('frontend/page/blog', {
            data_blog,
            pagination,
            slug,
            pageTitle
        })
    },

    ListSlug: async (req , res , next) => {
        let slug            = await paramsHelpers.getParam(req.params, 'slug', '')
        let search          = paramsHelpers.getParam(req.query, 'search', '') 

        if(slug === 'admin') {
            next()
        }
        if(slug === 'favicon.ico'){
            next()
        }

        let { item } =   await HomeService.findOneCategory({slug})
        if (item !== null) {
            let condition = {}

            let pagination = {
                totalItem       : 1,
                totalItemPerPage: 4,
                currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
                pageRange       : 3
            }
    
    
            let { categoryItems } =   await HomeService.findAllCategory()
    
            let arrIdCategory = []
            categoryItems.forEach(value => {
                arrIdCategory.push(value.id)
            })
    
            condition.status = "active"
            condition.id_category = item.id

            let pageTitle = item.name
            
            let { data_blog } =   await HomeService.ListBlog({condition, pagination})
    
            res.render('frontend/page/blog', {
                data_blog,
                pagination,
                slug,
                pageTitle
            })
        }
        else {
            let { item } =   await HomeService.findOneCategoryProduct({slug})
            if (item !== null) {
                let condition = {}

                let pagination = {
                    totalItem       : 1,
                    totalItemPerPage: 8,
                    currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
                    pageRange       : 3
                }
        
        
                let { categoryProductItems } =   await HomeService.findAllCategoryProduct()
        
                let arrIdCategory = []
                categoryProductItems.forEach(value => {
                    arrIdCategory.push(value.id)
                })
        
                condition.status = "active"
                condition.id_category = item.id
                
                let { data_product } =   await HomeService.ListProduct({condition, pagination})
        
                res.render('frontend/page/product', {
                    data_product,
                    pagination,
                    slug,
                    search
                })
            }
        }
    },

    ListBlogDetail: async (req , res , next) => {
        let slug            = paramsHelpers.getParam(req.params, 'slug', '')

        let { data_blog_detail } =   await HomeService.ListBlogDetail({slug})
        let idGroup = data_blog_detail.id_category

        let { data_product_group } =   await HomeService.listProductGroup({idGroup})
        
        res.render('frontend/page/blog_detail',{
            data_blog_detail,
            data_product_group
        })
    },

    ListIntroduce: async (req , res , next) => {

        res.render('frontend/page/introduce',{

        })
    },

    ListMembership: async (req , res , next) => {

        res.render('frontend/page/membership',{

        })
    },

    ListPolicy: async (req , res , next) => {

        res.render('frontend/page/policy',{

        })
    },

    ListLogin: async (req , res , next) => {
        if(req.isAuthenticated()) res.redirect('/')
        res.render('frontend/page/login',{
        })
    },

    ListSignup: async (req , res , next) => {
        res.render('frontend/page/signup',{
        })
    },

    ListCheckCode: async (req , res , next) => {
        const { username, password, hoten, phone, email } = req.body
        let item = {}

        item.username = username
        item.password = password
        item.hoten = hoten
        item.phone = phone
        item.email = email
        item.status = 'active'

        let data = JSON.stringify(item)

        let code = ramdomstring.generate(7)

        var transporter =  nodemailer.createTransport({ // config mail server
            service: 'Gmail',
            auth: {
                user: '18520878@gm.uit.edu.vn',
                pass: 'azeszsmbvatldpsw'
            }
        });
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: '18520878@gm.uit.edu.vn',
            to: item.email,
            subject: 'Mã Kích Hoạt',
            text: 'You recieved message from ' + req.body.email,
            html: `<p>Mã kích hoạt của bạn là: ${code}</p>`
        }
        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log(err);
                res.redirect('/dang-ky');
            } else {
                console.log('Message sent: ' +  info.response);
                res.render('frontend/page/check_code',{
                    code,
                    data
                })
            }
        });
    },

    CheckOut: async (req , res , next) => {
        res.render('frontend/page/check_out',{
        }) 
    },

    Invoice: async (req , res , next) => {
        let condition = {}
        let action            = await paramsHelpers.getParam(req.params, 'action', '')

        condition.idUserName = req.user._id.toString()
        if(action !== '') {
            condition.status = action
        }

        let { data }          = await HomeService.Invoice(condition)
        let donhang = []
        for (let i = 0; i < data.length; i++) {
            let sanpham = []
            let tongtien = 0
            for (let j = 0; j < data[i].sanpham.length; j++) {
                let item = JSON.parse(data[i].sanpham[j])
                let id = item.id
                let sumOneProduct = Number(item.price) * item.sl
                tongtien += sumOneProduct
                let { data_product_detail } =   await HomeService.findOneProduct({id})
                item.avatar = data_product_detail.avatar[0]
                item.name   = data_product_detail.name
                item.sumOneProduct = sumOneProduct
                sanpham.push(item)
            }
            let oneDonHang = {}
            oneDonHang.sanpham = sanpham
            oneDonHang.tongtien = tongtien
            donhang.push(oneDonHang)
        }

        res.render('frontend/page/invoice',{
            donhang
        }) 
    },

    Contact: async (req , res , next) => {
        req.body = JSON.parse(JSON.stringify(req.body))
        let item = Object.assign(req.body)

        let {dataSetting} = await SettingService.show_frontend()

        await new ContactModel(item).save().then((data) => {
            nodemailerHelpers.mail(dataSetting, req.body.email, data._id)
            res.send(data)
        })
    },
}