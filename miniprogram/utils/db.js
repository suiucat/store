const db = wx.cloud.database({
  env: "eshop-4xw0m",
});
const util = require("./util.js");

module.exports = {
  getProductList() {
    return db.collection("product").get();
  },
  
  getProductDetail(productId) {
    return wx.cloud.callFunction({
      name: "productDetail",
      data: {
        id: productId,
      }
    })
  },

  addToOrder(data) {
    return util.isAuthenticated()
    .then(() => {
       return wx.cloud.callFunction({
        name: "addToOrder",
        data,
      });
    }).catch(() => {
      wx.showToast({
        title: '请先登录',
      })
      return {};
    });
  },

  getOrders(userId) {
    return util.isAuthenticated().then(() => {
        return wx.cloud.callFunction({
          name: "getOrders",
        });
      }).catch(() => {
        return {};
      });
  }
}