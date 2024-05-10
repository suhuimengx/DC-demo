const db = uniCloud.database();
exports.main = async (event, context) => {
	let uploadRes = db.collection('share_hiking_database').add({
		api: 'upload',
		...event
	})
	return uploadRes;
};