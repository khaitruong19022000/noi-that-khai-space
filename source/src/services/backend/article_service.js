const ArticleModel = require(`${__path_models}article_model`)
const CategoryModel = require(`${__path_models}category_model`)

const utilsHelpers = require(`${__path_helpers}utils`)
const paramsHelpers = require(`${__path_helpers}params`)
const SlugHelpers   = require(`${__path_helpers}slug`)
const notify = require(`${__path_configs}notify`)
const fileHelpers = require(`${__path_helpers}file`)

const uploadAvatar = fileHelpers.upload('avatar', `${__path_public}uploads/items/`)

var { validationResult } = require('express-validator')
const util = require('util')

const routerName = 'article';
const renderName = `backend/page/${routerName}/`;



module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)

        let count = await ArticleModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await ArticleModel
            .find(obj.condition)
            .select('name avatar status ordering id_category created modified')
            .sort(obj.sort)
            .skip((obj.pagination.currentPage - 1) * obj.pagination.totalItemPerPage)
            .limit(obj.pagination.totalItemPerPage)

        return {
            data
        }

    },

    getListCategory: async () => { //getListCategory for list article
        let categoryItems = await CategoryModel.find({status: 'active'}, { id: 1, name: 1 })
        return {
            categoryItems
        }
    },

    countAll: async (obj) => { // Filter
        let statusFilter = utilsHelpers.createFilterStatus(obj.choosedStatus, ArticleModel, obj.arrIdCategory)
        return statusFilter
    },

    changeStatus: async (req, res) => { // Change status in table
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'active')
        let status = (currentStatus === 'active') ? 'inactive' : 'active'
        let data = {
            status: status,
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now()
            }
        }

        ArticleModel.updateOne({ _id: id }, data, (err, result) => {
        });

        return {
            success: true,
            id,
            currentStatus,
            status
        }
    },

    changeOrdering: async (req, res) => { // Change ordering in table
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let ordering = paramsHelpers.getParam(req.params, 'ordering', 0)
        ordering = (ordering < 0) ? 0 : ordering
        let data = {
            ordering: ordering,
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now()
            }
        }

        ArticleModel.updateOne({ _id: id }, data, (err, result) => {
        });
        return {
            success: true,
            id,
            ordering
        }

    },

    changeCategory: async (req, res) => { // Change category in table
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let id_category = paramsHelpers.getParam(req.params, 'id_category', 0)
        let data = {
            id_category: id_category,
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now()
            }
        }

        ArticleModel.updateOne({ _id: id }, data, (err, result) => {
        });
        return {
            success: true,
            id,
            id_category
        }

    },

    deleteItem: async (req, res) => { // Delete one items 
        let id            = paramsHelpers.getParam(req.params, 'id', '')

        await ArticleModel.findById(id).then((item) => {
            fileHelpers.remove('src/public/uploads/items/', item.avatar)
        })

        ArticleModel.deleteOne({_id:id}, (err,result) => {
            req.flash('warning', notify.DELETE_SUCCESS, false)           
            res.redirect('/admin/article/')
        });
    },

    getForm: async (req) => {  // (GetData for FORM, edit, add)
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let data = {}
        let categoryItems = await CategoryModel.find({status: 'active'}, { id: 1, name: 1 })
        categoryItems.unshift({ id: 'novalue', name: 'Choose Category' })

        if (id === '') { /// add
            pageTitle = 'Add - Form'
        } else { /// edit
            data = await ArticleModel.findById(id)
            pageTitle = 'Edit - Form'
        }
        return {
            pageTitle,
            data,
            categoryItems
        }
    },

    getSort: async (req, res) => { //  
        req.session.sortField      = paramsHelpers.getParam(req.params, 'sort_field', 'ordering')
        req.session.sortType       = paramsHelpers.getParam(req.params, 'sort_type', 'asc')
        
        res.redirect('/admin/article/')
    },

    getFilterCategory: async (req, res) => { //  
        req.session.idCategory      = paramsHelpers.getParam(req.params, 'id_category', '')
        
        res.redirect('/admin/article/')
    },

    saveItem: async (req, res) => { // (NewData add, edit item)
        uploadAvatar(req, res, async (err) => {
            req.body = JSON.parse(JSON.stringify(req.body))
            let item = Object.assign(req.body)

            let slug = SlugHelpers.slug(item.name)
            item.slug = slug
  
            if (err) {
                let errorArr = {}
                let data = {}

                let categoryItems = await CategoryModel.find({status: 'active'}, { id: 1, name: 1 })
                categoryItems.unshift({ id: 'novalue', name: 'Choose Category' })

                if(err.code === 'LIMIT_FILE_SIZE') err = 'Kích thước file ko phù hợp'
                errorArr['avatar'] = [err]

                if (item.id === '') { /// add
                    pageTitle = 'Add - Form'
                } else { /// edit
                    data = await ArticleModel.findById(item.id)
                    pageTitle = 'Edit - Form'
                }
                
                res.render(`${renderName}form`, {
                    pageTitle,
                    item: data,
                    errorArr,
                    categoryItems
                });
                return;
            }else{
                if (typeof item !== 'undefined' && item.id !== "") { //edit
                    if(req.file == undefined){
                        item.avatar = item.image_old;
                    } else {
                        item.avatar = req.file.filename;
                        fileHelpers.remove('src/public/uploads/items/', item.image_old)
                    }

                    ArticleModel.updateOne({ _id: item.id }, {
                        ordering: item.ordering,
                        status: item.status,
                        name: item.name,
                        slug: item.slug,
                        content: item.content,
                        short_description: item.short_description,
                        id_category: item.category,
                        avatar: item.avatar,
                        modified: {
                            user_id: 0,
                            user_name: 'admin',
                            time: Date.now()
                        }
                    }, (err, result) => {
                        req.flash('success', notify.EDIT_SUCCESS, false)
                        res.redirect('/admin/article/')
                    });
                } 
                else { // add
                    // item.avatar = []
                    // req.files.forEach((results) => {
                    //     item.avatar.push(results.filename)
                    // })
                    item.avatar = req.file.filename
                    item.id_category = item.category
                    item.created = {
                        user_id: 0,
                        user_name: "admin",
                        time: Date.now()
                    }
                    await new ArticleModel(item).save().then(() => {
                        req.flash('success', notify.ADD_SUCCESS, false)
                        res.redirect('/admin/article/')
                    })
                }
            }
        })
    },

    changeMultipleAction: async (req, res) => { // (Delete multiple, Change status multiple)
        let action = req.body.action
        let id     = req.body.cid
        if (action === 'delete') {
            if(Array.isArray(id)){
                for (let index = 0; index < id.length; index++) {
                    await ArticleModel.findById(id[index]).then((item) => {
                        fileHelpers.remove('src/public/uploads/items/', item.avatar)
                    })
                }
            } else {
                await ArticleModel.findById(id).then((item) => {
                    fileHelpers.remove('src/public/uploads/items/', item.avatar)
                })
            }

            ArticleModel.deleteMany({ _id: { $in: req.body.cid } }, (err, result) => {
                req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, result.deletedCount), false)
                res.redirect('/admin/article/')
            })
        } else {
            let data = {
                status: req.body.action,
                modified: {
                    user_id: 0,
                    user_name: 'admin',
                    time: Date.now()
                }
            }

            ArticleModel.updateMany({ _id: { $in: req.body.cid } }, data, (err, result) => {
                req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.modifiedCount), false)
                res.redirect('/admin/article/')
            })
        }

    },

    saveUpload: async (req, res) => {
        uploadAvatar(req, res, (err) => {
            let error = ''
            if (err) {
                error = err
            }
        })
         res.render(`${renderName}upload`);
    }

}
