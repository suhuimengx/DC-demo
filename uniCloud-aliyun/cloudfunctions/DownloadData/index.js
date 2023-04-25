const db = uniCloud.database();
exports.main = async (event, context) => {
	const dbDemo = await db.collection('dc-demo');
	console.log(event);
	//下载数据库中的数据
	let downloadRes = await dbDemo.where({
		userId: event.queryStringParameters.userId
	}).get();
	return downloadRes;
};