const db = uniCloud.database()
'use strict';
exports.main = async (event, context) => {
	let res = await db.collection("markers").get()
	return res
};
