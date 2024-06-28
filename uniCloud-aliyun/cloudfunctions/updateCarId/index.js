/**
 * @brief 更新数据库中对应订单的carid
 */
'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let res = {}
	const data = JSON.parse(event.body)
	const orderinfo = data.info
	res = await db.collection("share_hiking_database").doc(orderinfo.order_id).update({
		car_id:orderinfo.car_id
	})
	return res
};
