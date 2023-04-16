const routerName = 'dashboard';
const renderName = `backend/page/${routerName}/`;

const DashBoardService = require(`${__path_services}backend/dashboard_service`);

module.exports = {
    getList: async (req , res , next) => {
            let data = await DashBoardService.getList(req, res)

            res.render(`${renderName}index` , {
                items :  data,
            });
    },
}
