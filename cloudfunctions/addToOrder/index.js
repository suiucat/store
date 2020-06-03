// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxCtx = cloud.getWXContext();
  const user = wxCtx.OPENID; 

  const productList = event.list || [];
  const isCheckout = !!event.isCheckout;

  await db.collection('order').add({
    data: {
      user,
      createTime: +new Date(),
      productList,
    }
  });

  if (isCheckout) { // 购物车操作
    await db.collection('cart').where({
      productId: db.command.in(productList.map(product => product.productId))
    }).remove()
  }
  return {};
}