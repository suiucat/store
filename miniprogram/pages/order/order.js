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
      title: 'Loading...',
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
})