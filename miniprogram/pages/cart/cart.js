// page/cart/cart.js
const util = require('../../utils/util.js');
const db = require('../../utils/db.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    cartList: [],
    isSelectAllChecked: false,
    isCartEdit: false,
    cartCheckMap: {},
    cartTotal: 0,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    util.getUserInfo().then(userInfo => {

      this.getCart()
      
      console.log('已授权');
      this.setData({
        userInfo,
      });
    }).catch(err => {
      console.log('未授权');
    });
  },
  
  onTapCheck(event) {
    console.log(event, 'event');
    const checkId = event.currentTarget.dataset.id
    const cartCheckMap = this.data.cartCheckMap
    let isSelectAllChecked = this.data.isSelectAllChecked
    const cartList = this.data.cartList
    let cartTotal = 0

    // 全选
    if (checkId === 'selectAll') {
      isSelectAllChecked = !isSelectAllChecked
      cartList.forEach(product => {
        cartCheckMap[product.productId] = isSelectAllChecked;
      })
    } else {
      cartCheckMap[checkId] = !cartCheckMap[checkId]
      isSelectAllChecked = true
      cartList.forEach(product => {
        if (!cartCheckMap[product.productId]) {
          // 存在没选择的情况
          isSelectAllChecked = false
        }
      })
    }
    // 更新价格
    cartTotal = this.updateTotalPrice(cartList, cartCheckMap);
    this.setData({
      cartTotal,
      isSelectAllChecked,
      cartCheckMap
    })
  },
  // 计算价格
  updateTotalPrice(cartList, cartCheckMap) {
    let checkout = 0
    cartList.forEach(product => {
      if (cartCheckMap[product.productId]) checkout += product.price * product.count
    })

    return util.priceFormat(checkout)
  },
  onTapLogin(e) {
    this.setData({
      userInfo: e.detail.userInfo,
    });

    this.getCart();
  },

  getCart() {
    wx.showLoading({
      title: ''
    })
    const cartCheckMap = this.data.cartCheckMap
    db.getCart().then(result => {
      wx.hideLoading()

      const data = result.result

      if (data.length) {
        this.setData({
          cartTotal: util.priceFormat(0),
          cartList: data
        })
      }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()

      wx.showToast({
        icon: 'none',
        title: '操作失败'
      })
    })
  },
})