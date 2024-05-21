const db = uniCloud.database()
'use strict';
exports.main = async (event, context) => {
	let data = await db.collection("markers").get()
	const lastMarkers = data.data[data.data.length - 1].markers;
	console.log(lastMarkers)
	return lastMarkers
};
