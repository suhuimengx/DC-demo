/**
 * @brief 获取最新的一个需求数据
 */
const db = uniCloud.database();
exports.main = async (event, context) => {
	const dbDemo = db.collection('share_hiking_database');
	var old_id = event.queryStringParameters.old_id;
	let new_doc = dbDemo.where({
		_id: db.command.gt(old_id),
	}).limit(1).get();
	return new_doc;
};