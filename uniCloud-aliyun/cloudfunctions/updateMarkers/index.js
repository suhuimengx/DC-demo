/**
 * @brief 更新数据库中markers的位置
 */
'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log(event)
	let res = {}
	//返回数据给客户端
	const data = JSON.parse(event.body)
	const carinfo = data.marker_car
	if(carinfo.car_id==1){
		res = await db.collection("markers_cars").doc("665fd8303d029c65e9aa1798").update({
			car_01:{
				latitude:carinfo.latitude,
				longitude:carinfo.longitude
			}
		})
	}else if(carinfo.car_id==2){
		res = await db.collection("markers_cars").doc("665fd8303d029c65e9aa1798").update({
			car_02:{
				latitude:carinfo.latitude,
				longitude:carinfo.longitude
			}
		})
	}else if(carinfo.car_id==3){
		res = await db.collection("markers_cars").doc("665fd8303d029c65e9aa1798").update({
			car_03:{
				latitude:carinfo.latitude,
				longitude:carinfo.longitude
			}
		})
	}
	return res
};
