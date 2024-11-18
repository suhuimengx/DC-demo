/**
 * @brief 更新数据库中markers的服务对象
 */
'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log(event)
	let res = {}
	const data = JSON.parse(event.body)
	const carinfo = data.info
	const nCustomer = carinfo.nCustomer
	let cars = await db.collection("markers_cars").doc("665fd8303d029c65e9aa1798").get()
	let car_01 = cars.data[0].car_01
	for(let i=0;i<car_01.server_id.length;i++){
		if (car_01.server_id[i] > nCustomer) {
			car_01.server_id[i] += 1;
		}
	}
	let car_02 = cars.data[0].car_02
	for(let i=0;i<car_02.server_id.length;i++){
		if (car_02.server_id[i] > nCustomer) {
			car_02.server_id[i] += 1;
		}
	}
	let car_03 = cars.data[0].car_03
	for(let i=0;i<car_03.server_id.length;i++){
		if (car_03.server_id[i] > nCustomer) {
			car_03.server_id[i] += 1;
		}
	}
	res = await db.collection("markers_cars").doc("665fd8303d029c65e9aa1798").update({
		car_01:car_01,
		car_02:car_02,
		car_03:car_03
	})

	return res
};