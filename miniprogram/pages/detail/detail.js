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
      console.log(result, 'result');
      if (data) {
        this.setData({
          product: data,
        });
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
  buy() {
    wx.showLoading();

    const productToBuy = Object.assign({
      count: 1
    }, this.data.product)

    productToBuy.productId = productToBuy._id;
    db.addToOrder({
      list: [productToBuy], // 这里处理是为了数据结构一致
    }).then(res => {
      wx.hideLoading();
      const data = res.result;

      if (data) {
        wx.showToast({
          title: '购买成功',
        })
      }
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
      wx.showToast({
        icon: "none",
        title: '购买失败',
      })
    });
  },

  addToCart() {
    wx.showLoading({
      title: '',
    })

    db.addToCart(this.data.product).then(() => {
      wx.hideLoading()
      wx.showToast({
        title: '添加成功'
      })
    }).catch(err => {
      wx.hideLoading()

      wx.showToast({
        icon: 'none',
        title: 'Failed'
      })
    })
  },

  onTapReviewEntry() {
    if (this.data.product.reviewCount) {
      const product = this.data.product
      wx.navigateTo({
        url: `/pages/review/review?productId=${product._id}&price=${product.price}&name=${product.name}&image=${product.image}`,
      })
    }
  },
})