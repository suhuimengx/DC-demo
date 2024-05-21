/**
 * @brief 更新数据库中markers的位置
 */
'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log(event)

	//返回数据给客户端
	const data = JSON.parse(event.body)
	const res = await db.collection("markers").add({
            markers: data.markers,
            num: 2
        });
	return event.body
};
