// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID

  await db.collection('review').add({
    data: {
      user,
      username: event.username,
      avatar: event.avatar,
      content: event.content,
      productId: event.productId,
      createTime: +new Date(),
      images: (event.images || []).join(';'),
    },
  })

  return {}
}