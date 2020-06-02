module.exports = {
  priceFormat(price){
    return parseFloat(Math.round(price * 100) / 100).toFixed(2)
  }, // 2 digit for price

  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          console.log(res, 'res');
          if (res.authSetting['scope.userInfo'] === true) { // 已授权
            wx.getUserInfo({
              success(res) {
                const userInfo = res.userInfo;
                resolve(userInfo);
              }
            });
          } else {// 未授权
            reject();
          }
        }
      })
    });  
  }
}