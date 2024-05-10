/**
 * @brief 获取数据库中当前的doc数量
 */
'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const dbDemo = db.collection("share_hiking_database");
	let num = dbDemo.count();
	return num;
};