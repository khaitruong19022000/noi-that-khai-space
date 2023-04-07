const MenuService = require(`${__path_services}backend/menu_service`);
const SettingService = require(`${__path_services}backend/setting_service`);
const CategoryService = require(`${__path_services}backend/category_service`);

module.exports = {
    getMenu: async (req) => {
       let getMenu = await MenuService.show_frontend()
       return getMenu
    },

    getSetting: async (req) => {
       let getSetting = await SettingService.getSetting()
       return getSetting
    },

    getCategory: async (req) => {
      let getSetting = await CategoryService.show_frontend()
      return getSetting
   },

};