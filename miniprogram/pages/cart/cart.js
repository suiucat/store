// page/cart/cart.js
const util = require('../../utils/util.js');
const db = require('../../utils/db.js')

Page({

  data: {
    userInfo: null,
    cartList: [],
    isSelectAllChecked: false,
    isCartEdit: false,
    cartCheckMap: {},
    cartTotal: 0,
  },

  onShow: function () {
    //做一些初始化

    util.getUserInfo().then(userInfo => {
      this.getCart()
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

    // 计算总的价格
    cartTotal = this.updateTotalPrice(cartList, cartCheckMap);
    this.setData({
      cartTotal,
      isSelectAllChecked,
      cartCheckMap
    })
  },
  /* 编辑商品 */
  onTapEditCart(event) {
      console.log(this.data.isCartEdit, 'this.data.isCartEdit');
      if (!this.data.isCartEdit) {
        this.setData({
          isCartEdit: true,
        }); 
      } else {
        this.updateCart();
      }
  },
  /* 更新购物车数据 */
  updateCart() {
    wx.showLoading({
      title: '拼命加载中...',
    });

    const cartList = this.data.cartList;
    db.updateCart(cartList).then((result) => {
      wx.hideLoading();
      const data = result.result;
      if (data) {
        this.setData({
          isCartEdit: false,
        });
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '操作失败'
      })
    });
    
  },
  /* 编辑操作 */
  adjustCartProductCount(event) {
    const dataset = event.currentTarget.dataset;
    const adjustType = dataset.type;
    const productId = dataset.id;

    const cartCheckMap = this.data.cartCheckMap;
    let cartList = this.data.cartList;
    // 获取需要调整数量的商品
    const productToAdjust = cartList.find((product) => product.productId === productId) || {};
    if (adjustType === "add") {
      productToAdjust.count ++;
    } else {
      if (productToAdjust.count > 2) {
        productToAdjust.count --;
      } else {
        delete cartCheckMap[productId];
        cartList = cartList.filter(product => product.productId !== productId);
      }
    }

    const cartTotal = this.updateTotalPrice(cartList, cartCheckMap);
    this.setData({
      cartTotal,
      cartList,
    })
    /* 购物车为空 跳出编辑状态时需要更新下购物车数据 */
    if (!cartList.length) {
      this.updateCart();  
    }
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

  onTapCheckout(event) {
    if (this.data.cartTotal === 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择商品',
      });
      return;
    }
    wx.showLoading({
      title: ''
    })

    const cartCheckMap = this.data.cartCheckMap;
    const cartList = this.data.cartList;
    const productsToCheckout = cartList.filter(product => cartCheckMap[product.productId]);
    const cartToUpdate = cartList.filter(product => {
      return !cartCheckMap[product.productId]
    });

    db.addToOrder({
      list: productsToCheckout,
      isCheckout: true
    }).then(result => {
      wx.hideLoading()
      const data = result.result
      if (data) {
        wx.showToast({
          title: 'Succeed',
        })

        this.setData({
          cartList: cartToUpdate,
        })

        this.getCart()
      }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()  
    })
  },

  getCart() {
    wx.showLoading({
      title: '拼命加载中...'
    })
    db.getCart().then(result => {
      wx.hideLoading();

      const data = result.result;

      if (data.length) {
        this.setData({
          cartTotal: util.priceFormat(0),
          cartList: data,
        })
      }
    }).catch(err => {
      console.error(err);
      wx.hideLoading();

      wx.showToast({
        icon: 'none',
        title: '操作失败'
      });
    })
  },
})