/**
 * @brief 获取程序开始运行时数据库中最后一条doc的_id，便于获取最新doc
 */
'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const dbDemo = db.collection("share_hiking_database");
	var skip_num = event.queryStringParameters.num;
	var res = await dbDemo.skip(skip_num - 1).get();
	return res;
};