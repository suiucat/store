// page/home/home.js
const db = require("../../utils/db.js");
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductList();
  },
  /** 
   *  业务逻辑
   */
  getProductList() {
    wx.showLoading({
      title: "Loading...",
    })

    db.getProductList().then(result => {
      // console.log(result);
      wx.hideLoading();

      const data = result.data;
      // 2 digits for price
      data.forEach(product => product.price = utils.priceFormat(product.price))

      if (data.length) {
        this.setData({
          productList: data,
        });
      }
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
    });
  },
})