const routerName = 'article';
const renderName = `backend/page/${routerName}/`;

const { validationResult } = require('express-validator')
const util = require('util')

const utilsHelpers = require(`${__path_helpers}utils`)
const paramsHelpers = require(`${__path_helpers}params`)
const SlugHelpers   = require(`${__path_helpers}slug`)
const notify = require(`${__path_configs}notify`)
const fileHelpers = require(`${__path_helpers}file`)

const uploadAvatar = fileHelpers.upload('avatar', `${__path_public}uploads/items/`)

const ArticleService = require(`${__path_services}backend/article_service`);


module.exports = {
    getlist : async (req , res , next) => {
        let condition = {}
        let keyword = paramsHelpers.getParam(req.query, 'keyword', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'all')

        let { categoryItems } = await ArticleService.getListCategory()
        let categoryItemsFilter = [...categoryItems];
        let arrIdCategory = []
        categoryItems.forEach(value => {
            arrIdCategory.push(value.id)
        })
        let sortField   = paramsHelpers.getParam(req.session, 'sortField', 'ordering')
        let sortType    = paramsHelpers.getParam(req.session, 'sortType', 'asc')
        let idCategory  = paramsHelpers.getParam(req.session, 'idCategory', '')
        let sort = {}

        categoryItemsFilter.unshift({ id: 'allvalue', name: 'All Category' })

        let pagination = {
            totalItem: 1,
            totalItemPerPage: 5,
            currentPage: parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
            pageRange: 3
        }
        sort[sortField] = sortType

        condition.id_category = { $in: arrIdCategory }
        if (idCategory !== '' && idCategory !== 'allvalue') condition.id_category = idCategory
        if (currentStatus !== 'all') condition.status = currentStatus
        if (keyword !== '') condition.name = { $regex: keyword, $options: 'i' }

        let { data }  = await ArticleService.getAll({condition, pagination, sort})

        let choosedStatus = req.params.status;
        let statusFilter = await ArticleService.countAll({choosedStatus, arrIdCategory})

        let pageTitle = 'Blog Article'
 
        res.render(`${renderName}list` , {
            items :        data,
            pageTitle,
            currentStatus,
            keyword,
            pagination,
            statusFilter:  statusFilter,
            categoryItems,
            categoryItemsFilter,
            sortType,
            sortField,
            idCategory
        })
    },

    getForm : async (req , res , next) => {
        let { pageTitle, data, categoryItems } = await (ArticleService.getForm(req))
        res.render(`${renderName}form` , {
            pageTitle,
            items :  data,
            categoryItems
        });
    },

    getStatus: async (req , res , next) => {
        let data = await ArticleService.changeStatus(req, res)
        res.send(data) 
    },

    getOrdering: async (req, res, next) => {
        let data = await ArticleService.changeOrdering(req, res)
        res.send(data)
    },

    getCategory: async (req, res, next) => {
        let data = await ArticleService.changeCategory(req, res)
        res.send(data)
    },

    deleteItem: async (req , res , next) => {
        await ArticleService.deleteItem(req, res)
    },

    saveItem: async (req, res, next) => {
        await ArticleService.saveItem(req, res)
    },

    changeMultipleAction: async (req, res, next) => {
        await ArticleService.changeMultipleAction(req, res)
    },

    getUpload: async (req, res, next) => {
        res.render(`${renderName}upload`);
    },

    saveUpload: async (req, res, next) => {
        await ArticleService.saveUpload(req, res)
    },

    getSort: async (req , res , next) => {
        await ArticleService.getSort(req, res)
    }, 

    getFilterCategory: async (req , res , next) => {
        await ArticleService.getFilterCategory(req, res)
    },

    getRss: async (req , res , next) => {
        res.send('Hello')
    },
}
