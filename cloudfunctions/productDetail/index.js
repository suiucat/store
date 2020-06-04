// 云函数入口文件
const cloud = require('wx-server-sdk')

 cloud.init()

 const db = cloud.database()

 // 云函数入口函数
exports.main = async (event, context) => {
  const id = event.id

   // 商品详情
  const productRes = await db.collection('product').doc(id).get()
  const product = productRes.data

  // 商品的所有评论
  const reviewCountRes = await db.collection('review').where({
    productId: product._id,
  }).count()
  product.reviewCount = reviewCountRes.total

  // 商品的第一条评论
  const firstReviewRes = await db.collection('review').where({
    productId: product._id,
  }).limit(1).get()
  product.firstReview = firstReviewRes.data[0]

  return product
}