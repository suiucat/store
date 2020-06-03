// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxCtx = cloud.getWXContext();
  const user = wxCtx.OPENID; 
  // const user = event.userInfo.openId

  console.log(event, 'event');
  const productList = event.list || [];

  await db.collection('order').add({
    data: {
      user,
      createTime: +new Date(),
      productList,
    }
  });
  return {};
}