const db = wx.cloud.database({
  env: "eshop-4xw0m",
});

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
}