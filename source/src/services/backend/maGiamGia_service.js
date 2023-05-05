const maGiamGiaModel = require(`${__path_models}maGiamGia_model`)
const utilsHelpers  = require(`${__path_helpers}utils`)

module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)

        let count = await maGiamGiaModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await maGiamGiaModel
                            .find(obj.condition)
                            .sort(obj.sort)
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)

        return{
            data
        }

    },

    countAll: async (obj) => { // Filter 
        let statusFilter = utilsHelpers.createFilterStatus(obj.choosedStatus, maGiamGiaModel)
        return statusFilter
    },

    changeStatus: async (obj) => { // Change status in table

        maGiamGiaModel.updateOne({_id: obj.id}, {status: obj.status}, (err,result) => {
        });
        
        return {
            success: true,
        }
    },

    changeNumber: async (obj) => { // Change ordering in table
        maGiamGiaModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    deleteItem: async (obj) => { // Delete one items 
       await maGiamGiaModel.deleteOne({_id: obj.id});
    },

    getForm: async (obj) => {  // (GetData for FORM, edit, add)
        let data          = {}

        if(obj.id === ''){ /// add
            pageTitle = 'Add - Form'
        }else { /// edit
            data = await maGiamGiaModel.findById(obj.id)
            pageTitle = 'Edit - Form'
        }

        return {
            pageTitle,
            data
        }
    },

    editItem: async (obj) => { // (edit item)
        await maGiamGiaModel.updateOne({_id:obj.id}, {
                ordering: obj.ordering,
                status: obj.status,
                name: obj.name,
                slug: obj.slug,
                content: obj.content
            });
    },

    addItem: async (obj) => { // (NewData add)
        await new maGiamGiaModel(obj).save()
    },

    ChangeDeleteMultiple: async (obj) => { // (Delete multiple)
        let deletedCount
        await maGiamGiaModel.deleteMany({_id: {$in: obj.arrId}}).then((result) => {
            deletedCount = result.deletedCount
        });

        return{
            deletedCount
        } 
    },

     ChangeStatusMultiple: async (obj) => { // (Change status multiple)
        let modifiedCount
        await maGiamGiaModel.updateMany({_id: {$in: obj.arrId}}, {status: obj.action}).then((result) =>{
            modifiedCount = result.modifiedCount
        });

        return{
            modifiedCount
        } 
    },

    show_frontend: async () => {
        let data = await maGiamGiaModel.find({status: "active"})
        return {
            data
        }
    },

}
