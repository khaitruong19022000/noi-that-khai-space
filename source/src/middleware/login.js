const CategoryAccountService = require(`${__path_services}backend/category_account_service`);

module.exports = async (req, res, next) => {

    if(req.isAuthenticated()){
        let {data} = await CategoryAccountService.findIdAdmin(req.user.role)

        if(data.name === 'admin'){
            next()
        }
        else{
            res.redirect('/admin/no-permission')
            res.end()
        }
    }else {
        res.redirect('/dang-nhap')
    }
};