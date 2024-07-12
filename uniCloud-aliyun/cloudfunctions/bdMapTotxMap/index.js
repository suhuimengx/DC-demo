'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let lat = event.latitude;
	let lng = event.longitude;
	let pi = (3.14159265358979324 * 3000.0) / 180.0;
	let x = lng - 0.0065;
	let y = lat - 0.006;
	let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi);
	let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi);
	lng = z * Math.cos(theta);
	lat = z * Math.sin(theta);
	//返回数据给客户端
	console.log(`{ lng: ${lng}, lat: ${lat} }`)
	return { lng: lng, lat: lat };
};
