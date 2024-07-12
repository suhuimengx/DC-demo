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
	if(carinfo.car_id==1){
		res = await db.collection("markers_cars").doc("665fd8303d029c65e9aa1798").update({
			car_01:{
				server_id:carinfo.server_id
			}
		})
	}else if(carinfo.car_id==2){
		res = await db.collection("markers_cars").doc("665fd8303d029c65e9aa1798").update({
			car_02:{
				server_id:carinfo.server_id
			}
		})
	}else if(carinfo.car_id==3){
		res = await db.collection("markers_cars").doc("665fd8303d029c65e9aa1798").update({
			car_03:{
				server_id:carinfo.server_id
			}
		})
	}
	return res
};
