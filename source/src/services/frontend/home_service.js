
const MenuModel = require(`${__path_models}menu_model`)
const SliderModel = require(`${__path_models}slider_model`)
const ArticleModel = require(`${__path_models}article_model`)
const CategoryModel = require(`${__path_models}category_model`)
const CategoryProductModel = require(`${__path_models}category_product_model`)
const ProductModel = require(`${__path_models}product_model`)
const DonHangModel = require(`${__path_models}donHang_model`)

module.exports = {
//--- pageHomeStart ---
    ListSlider: async () => {
        let data_slider = await SliderModel.find({status: 'active'}).sort({ordering : 1})

        return {
            data_slider
        }
    },

    listProductSpecial: async () => {
        let condition = {
            status:  'active',
            arrCheck: { $in: [ "special" ] },
        }

        let data_product_special = await ProductModel.find(condition).sort({ordering : 1}).limit(3)

        return {
            data_product_special
        }
    },

    listProductShowHome: async () => {
        let condition = {
            status:  'active',
            arrCheck: { $in: [ "show_home" ] },
        }

        let data_product_show_home = await ProductModel.find(condition).sort({ordering : 1}).limit(11)

        return {
            data_product_show_home
        }
    },

    listBlogShowHome: async () => {
        let condition = {
            status:  'active',
        }

        let data_blog_show_home = await ArticleModel.find(condition).sort({ordering : 1}).limit(1)

        return {
            data_blog_show_home
        }
    },
//--- pageHomeEnd ---

    findOneProduct: async (obj) => {

        let data_product_detail = await ProductModel.findById({_id: obj.id})

        return {
            data_product_detail
        }
    },

    findOneCategory: async (obj) => {
        let item = await CategoryModel.findOne({ slug: obj.slug})
        return {
            item
        }
    },

    findOneCategoryProduct: async (obj) => {
        let item = await CategoryProductModel.findOne({ slug: obj.slug})
        return {
            item
        }
    },

    findAllCategory: async () => {
        let categoryItems = await CategoryModel.find({status: 'active'}, { id: 1, name: 1 })
        return {
            categoryItems
        }
    },

    findAllCategoryProduct: async () => {
        let categoryProductItems = await CategoryProductModel.find({status: 'active'}, { id: 1, name: 1 })
        return {
            categoryProductItems
        }
    },

    ListBlog: async (obj) => {
        let count = await ArticleModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data_blog = await ArticleModel
                            .find(obj.condition)
                            .sort({ordering : 1})
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)
        return {
            data_blog
        }
    },

    ListProduct: async (obj) => {
        let count = await ProductModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data_product = await ProductModel
                            .find(obj.condition)
                            .sort({ordering : 1})
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)
        return {
            data_product
        }
    },

    ListBlogDetail: async (obj) => {
        data_blog_detail    = await ArticleModel.findOne({ slug: obj.slug })

        return {
            data_blog_detail,
        }
    },

    listProductGroup: async (obj) => {
        let condition = {
            status:  'active',
            id_group_category: obj.idGroup,
        }

        let data_product_group = await ProductModel.find(condition).sort({ordering : 1}).limit(8)

        return {
            data_product_group,
        }
    },

    Invoice: async (obj) => {
        let data = await DonHangModel.find(obj)

        return {
            data
        }
    }
}
