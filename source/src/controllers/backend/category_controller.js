const routerName = 'category';
const renderName = `backend/page/${routerName}/`;

const CategoryService = require(`${__path_services}backend/category_service`);


module.exports = {
    getlist : async (req , res , next) => {
        // Promise.all([])
        let { data, currentStatus, keyword, pagination, sortType, sortField }  = await CategoryService.getAll(req)
        let statusFilter                                  = await CategoryService.countAll(req)
        let pageTitle = 'Blog Category'
 
        res.render(`${renderName}list` , {
            items :        data,
            pageTitle,
            currentStatus,
            keyword,
            pagination,
            statusFilter:  statusFilter,
            sortType,
            sortField
        })
    },

    getForm : async (req , res , next) => {
        let { pageTitle, data } = await (CategoryService.getForm(req))

        res.render(`${renderName}form` , {
            pageTitle,
            items :  data
        });
    },

    getSort: async (req , res , next) => {
        await CategoryService.getSort(req, res)
    },

    getStatus: async (req , res , next) => {
        let data = await CategoryService.changeStatus(req, res)
        res.send(data) 
    },

    getOrdering: async (req, res, next) => {
        let data = await CategoryService.changeOrdering(req, res)
        res.send(data)
    },

    deleteItem: async (req , res , next) => {
        await CategoryService.deleteItem(req, res)
    },

    saveItem: async (req, res, next) => {
        await CategoryService.saveItem(req, res)
    },

    changeMultipleAction: async (req, res, next) => {
        await CategoryService.changeMultipleAction(req, res)
    },

}
