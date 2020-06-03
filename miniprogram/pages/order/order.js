// page/order/order.js
const util = require('../../utils/util.js');
const db = require('../../utils/db.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    orderList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onTapLogin(e) {
    this.setData({
      userInfo: e.detail.userInfo,
    });
  },

  getOrders() {
    wx.showLoading({
      title: '拼命加载中...',
    })
    db.getOrders().then((res) => {
      wx.hideLoading();
      const data = res.result.data;  
      if (data) {
        this.setData({
          orderList: data,
        })
      }
    }).catch((err) => {
      wx.hideLoading();
      wx.showToast({
        icon: "none",
        title: "加载失败",
      });
      console.log(err);
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
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo,
      });

      this.getOrders();
    }).catch(err => {
      console.log('未授权');
    });
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