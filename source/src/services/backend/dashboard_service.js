const ArticleModel = require(`${__path_models}article_model`)
const CategoryModel = require(`${__path_models}category_model`)
const MenuModel = require(`${__path_models}menu_model`)
const SliderModel = require(`${__path_models}slider_model`)

module.exports = {
    getList: async (req, res) => {
        let data = {}

        data.category = await CategoryModel.find({}).count()
        data.article  = await ArticleModel.find({}).count()
        data.menu     = await MenuModel.find({}).count()
        data.slider   = await SliderModel.find({}).count()

        return data;
    },
    
}
