// pages/detail/detail.js
const db = require("../../utils/db.js");
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const currentProductId = options.id;
    this.getProductDetail(currentProductId);
  },
  /* 业务逻辑 */
  getProductDetail(productId) {
    wx.showLoading({
      title: '拼命加载中...',
    })
    db.getProductDetail(productId).then(result => {
      const data = result.result;
      // 价格保留两位小数
      data.price = utils.priceFormat(data.price);
      if (data) {
        this.setData({
          product: data,
        });
        console.log(this.data, "id" + productId);
        wx.hideLoading();
      } else {
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      }
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})