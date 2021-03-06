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
  },

  addToCart(data) {
    return util.isAuthenticated().then(() => {
      return wx.cloud.callFunction({
        name: 'addToCart',
        data,
      });
    }).catch(() => {
      console.log("addToCart未授权");
      return {};
    });
  },

  getCart() {
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'getCart',
         })
      }).catch(() => {
        wx.showToast({
          icon: 'none',
          title: '请先登录'
        })
        return {}
      })
  },

  updateCart(list) {
    return util.isAuthenticated()
    .then(() => {
      return wx.cloud.callFunction({
        name: 'updateCart',
        data: {
          list,
        }
      });
    }).catch(err => {
      wx.showToast({
        icon: 'none',
        title: '请先登录'
      })
      return {}
    });
  },

  addReview(data) {
    return util.isAuthenticated()
    .then(() => {
      wx.cloud.callFunction({
        name: "addReview",
        data,
      });
    })
    .catch(() => {
      wx.showToast({
        icon: 'none',
        title: '请先登录'
      })

      return {}
    });
  },

  getReviews(productId) {
    return db.collection('review').where({
      productId,
    }).get()
  },

  uploadImage(imgPath) {
    return wx.cloud.uploadFile({
      cloudPath: `review/${util.getId()}`,
      filePath: imgPath,
    })
  },
}