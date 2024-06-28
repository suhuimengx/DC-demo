<template>
	<view>
		<!-- 1.顶部导航栏 -->
		<u-navbar bgColor="#f2c7c0">
			<view slot="left" class="leftSolt">
				<u-icon name="map-fill" size="32" color="#000000"></u-icon>
				<view style="margin-left: 5rpx;margin-right: 8rpx;color: dimgray;font-size: 28rpx;">仙林大道163号</view>
				<u-icon name="arrow-down-fill" color="#000000" size="15px"></u-icon>
			</view>
		</u-navbar>
		<!-- 2.简略地图部分 -->
		<view class="map">
			<map style="width: 100%; height: 800rpx;" :latitude="map_center_latitude" :longitude="map_center_longitude" id="map" :markers="markers_originPlace"></map>
		</view>
		<!-- 3.地址框部分 -->
		<!-- 3.1选择出发地 -->
		<view class="searchAddr">
			<u-search :placeholder="originPlace" :showAction="false" height="80rpx" searchIcon="play-right"
				:disabled="true" @click="showOrign = true" borderColor="#313c4b" searchIconColor="black">
			</u-search>
			<u-picker :show="showOrign" :columns="columns" title="出发地" @cancel="showOrign = false"
				@confirm="confirmOrigin"></u-picker>
		</view>
		<!-- 3.2选择目的地 -->
		<view class="searchAddr">
			<u-search :placeholder="destPlace" :showAction="false" height="80rpx" searchIcon="play-right"
				:disabled="true" @click="showDest=true" borderColor="#313c4b" searchIconColor="black">
			</u-search>
			<u-picker :show="showDest" :columns="columns" title="目的地" @cancel="showDest = false" @confirm="confirmDest">
			</u-picker>
		</view>
		<!-- 4.选择订单详情按钮 -->
		<view class="hint">
			<u-icon name="info-circle" size="24px" color="#445469"></u-icon>
			<u-text type="info" text="点击下方按钮跳转出行详情选择页面">
			</u-text>
		</view>
		<view class="button">
			<u-button text="订单详情" type="primary" icon="thumb-up" @click="goDetail" shape="circle" color="#e8627b"
				size="large"></u-button>
		</view>
		<button @click="testapi">test</button>
		<u-toast ref="uToast_index"></u-toast>

	</view>
</template>

<script>
	import markers_originPlace from '../../static/common/my_data';
	const db = uniCloud.database()
	export default {
		data() {
			return {
				car_serving:{},
				car_id:-1,
				markers_originPlace,
				marker_icon_path:"/",
				//src_label_origin:"../../static/icon-pick-up",
				markers_width:20,
				markers_height:30,
				mapSrc: 'https://cdn.uviewui.com/uview/album/1.jpg',
				showOrign: false,
				showDest: false,
				originIndex: -1, //出发地id
				destIndex: -1, //目的地id
				originPlace: "请选择出发地",
				destPlace: "请选择目的地",
				transferStatus: false, //判断地址是否完成选择
				columns: [
					["0-宿舍区0", "1-南门", "2-行政南楼", "3-图书馆", "4-教学楼", "5-实验楼", "6-体育馆", "7-活动中心", "8-宿舍区1", "9-宿舍区2",
						"10-快递中心", "11-校医院", "12-九食堂", "13-气象楼", "14-环境学院", "15-信息中心", "16-游泳馆", "17-美术馆", "18-宿舍区3",
						"19-宿舍区4", "20-宿舍区5", "21-医学院", "22-建设银行", "23-现工院"
					]
				],
				map_center_latitude: 32.113475,
				map_center_longitude: 118.960198,
				markers_last_time:[],
				markers:[
					{id:111,latitude: 32.113475,longitude: 118.960198,width:20,height:30},
					{id:222,latitude: 32.11355,longitude: 118.960198,width:20,height:30}
				],
				car_init:{id:111,latitude: 5.113475,longitude: 5.960198,width:20,height:30},
				timer:null
			};
		},
		onLoad() {
			
			uni.login({
				provider: 'weixin',
				success: (res) => {
					let code = res.code;
					uniCloud.callFunction({
						name: 'logIn',
						data: {
							code: code
						}
					}).then(openid => {
						console.log("用户ID:", openid.result);
						uni.setStorageSync('userId', openid);
					})
				}
			})
			//this.addMarker(this.car_init)
		},
		onShow() {
			if(getApp().globalData.executeFunction)
			{
				this.waitDispatch()
				this.renewmarkers()
				getApp().globalData.executeFunction = false
			}
		},
		mounted() {
			//添加计时器，轮询方式更新小车位置
			/*
			if(this.timer){
				clearInterval(this.timer)
			}else{
				this.timer = setInterval(()=>{
					console.log("更新位置")
					this.updatemarkers()
				},5000);
			}
			*/
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		methods: {
			//辅助函数，判断用户未登录时跳转登录页面
			checkLogin(){
				let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo')||{}
				if(!hostUserInfo._id){
					uni.navigateTo({
						url:"/uni_modules/uni-id-pages/pages/login/login-withpwd?showtoastFlag=true"
					})
				}
			},
			//选择出发地后触发事件
			confirmOrigin(res) {
				this.checkLogin()
				console.log('confirmOrigin', res)
				this.showOrign = false;
				this.originIndex = res.indexs[0];
				this.originPlace = res.value[0];
				console.log('originIndex', this.originIndex)
				this.moveMap(this.markers_originPlace[this.originIndex])
			},
			//选择目的地后触发事件
			confirmDest(res) {
				this.checkLogin()
				console.log('confirmDest', res)
				this.showDest = false;
				this.destIndex = res.indexs[0];
				this.destPlace = res.value[0];
				console.log('destIndex', this.destIndex);
				
				this.mapContent = uni.createMapContext("map",this);
				this.mapContent.includePoints({
					points:[
						{latitude:this.markers_originPlace[this.originIndex].latitude,longitude:this.markers_originPlace[this.originIndex].longitude},
						{latitude:this.markers_originPlace[this.destIndex].latitude,longitude:this.markers_originPlace[this.destIndex].longitude}
					],
					padding:[50,50,50,50]
				})
			},
			//跳转订单详情信息页面（页面detail）
			goDetail() {
				this.checkLogin()
				if (this.originIndex == -1 || this.destIndex == -1) {
					this.transferStatus = false;
					this.$refs.uToast_index.show({
						type: 'warning',
						position: "bottom",
						message: "请选择出发地和目的地~",
						duration: 2100
					})
				} else {
					this.transferStatus = true;
					
					uni.navigateTo({
						//向detail页面传递 起始地id和目的地id
						url: `/pages/detail/detail?originId=${this.originIndex}&destId=${this.destIndex}`
					});
				}
			},
			test() {
				let uid = 'o3vDU5cxZbg1ZgaBnQk9AtZW50rg';
				uniCloud.callFunction({
					name: "DownloadData",
					data: {
						userId: uid
					}
				}).then(res => {
					console.log(res)
				})
			},
			//获取地图中心（测试用）
			getMapCenter(){
				this.mapContent = uni.createMapContext("map",this);
				this.mapContent.getCenterLocation({
					success:(res)=>{console.log(res)}
				})
			},
			//在地图上添加marker
			addMarker(marker1){
				console.log( marker1)
				if(!marker1){
					console.log("marker1传入为空")
				}else{
					this.mapContent = uni.createMapContext("map",this);
					this.mapContent.addMarkers({
						markers:[{
							id:111,
							latitude:marker1.latitude,
							longitude:marker1.longitude,
							width:20,
							height:30,
							label:{content: `${this.car_id}号车`,borderWidth: 1,borderColor: '#C8F2C1',anchorX:-20,anchorY:0,bgColor:"#C8F2C1",borderRadius:15,padding:2},
							iconPath:'/static/icon/car.png'
							
						}],
						success:()=>{console.log("添加成功")}
					
					})
				}
			},
			//订单选择完成后，清除起始点外的marker
			renewmarkers(){
				this.mapContent = uni.createMapContext("map",this);
				this.mapContent.removeMarkers({
					markerIds:["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
				})
				console.log(this.markers_originPlace[this.originIndex])
				this.mapContent.addMarkers({
					markers:[
						{
							id:this.originIndex,
							latitude:this.markers_originPlace[this.originIndex].latitude,
							longitude:this.markers_originPlace[this.originIndex].longitude,
							width:30,
							height:30,
							iconPath:"/static/icon/originmarker.png",
							label:{content:"起点",borderWidth: 1,borderColor: '#C8F2C1',anchorX:-20,anchorY:0,bgColor:"#C8F2C1",borderRadius:15,padding:2}
						},
					{
						id:this.destIndex,
						latitude:this.markers_originPlace[this.destIndex].latitude,
						longitude:this.markers_originPlace[this.destIndex].longitude,
						width:30,
						height:30,
						iconPath:"/static/icon/destmarker.png",
						label:{content:"终点",borderWidth: 1,borderColor: '#C8F2C1',anchorX:-20,anchorY:0,bgColor:"#C8F2C1",borderRadius:15,padding:2}
					}
					],
				})
			},
			//小车移动动画
			moveAnimation(ori_marker,des_marker){
				
			},
			testapi(){
				uniCloud.callFunction({
					name: "updateMarkers",
				}).then(res => {
					console.log(res)
				})
			},
			/*
			//平滑移动小车（test）
			moveMarker(){
				this.mapContent = uni.createMapContext("map",this);
				this.mapContent.translateMarker({
					markerId:111,
					destination:{latitude:32.113041,longitude:118.960575},
					retate:0,
					autoRotate:false,
					duration:1000
				})
			},
			*/
			moveMap(res){
				console.log(res)
				this.map_center_latitude = res.latitude
				this.map_center_longitude = res.longitude
				console.log(res.latitude)
			},
			//下单后等待后端处理完成
			async waitDispatch() {
			  uni.showToast({
			    title: '订单处理中~',
			    icon: 'loading',
			    duration: 60000 // 设置较长的持续时间，后面会手动关闭
			  });
			
			  try {
			    const orderId = getApp().globalData.order_id;
			    
			    // 先查询一次订单状态
			    const orderStatus = await this.getOrderStatus(orderId);
			    if (orderStatus.car_id > 0) {
			      // 如果状态已经变化，立即关闭 Toast 提示框并进行处理
			      uni.hideToast();
			      this.handleOrderStatus(orderStatus.car_id);
			    } else {
			      // 否则，开始轮询状态变化
			      this.pollOrderStatus(orderId);
			    }
			  } catch (error) {
			    uni.showToast({
			      title: '订单处理失败',
			      icon: 'none'
			    });
			  }
			},
			//辅助函数，查询订单信息
			async getOrderStatus(orderId) {
			  const db = uniCloud.database();
			  const res = await db.collection('share_hiking_database').doc(orderId).get();
			  return res.result.data[0];
			},
			//辅助函数，轮询查询
			pollOrderStatus(orderId) {
			  const intervalId = setInterval(async () => {
			    try {
			      const orderStatus = await this.getOrderStatus(orderId);
			      if (orderStatus.car_id > 0) {
			        // 关闭Toast提示框
			        uni.hideToast();
			        // 处理car_id
			        this.handleOrderStatus(orderStatus.car_id);
			        // 停止轮询
			        clearInterval(intervalId);
			      }
			    } catch (error) {
			      console.error(error);
			      uni.showToast({
			        title: '订单状态获取失败',
			        icon: 'none'
			      });
			      // 根据需要停止轮询
			      clearInterval(intervalId);
			    }
			  }, 1000); 
			},
			//后端对订单处理后执行此函数
			handleOrderStatus(carId) {
				this.car_id = carId
				console.log(this.car_id)
				//告知用户服务信息
				this.$refs.uToast_index.show({
					type: 'success',
					position: "bottom",
					message: `${this.car_id}号车将为您提供服务~`,
					duration: 4100
				})
				//设置定时器，轮询更新小车位置
				if(this.timer){
					clearInterval(this.timer)
				}else{
					this.timer = setInterval(()=>{
						console.log("更新小车位置")
						this.getCarInfo(this.car_id).then(() => {
							this.updataMarkerCar();
							this.mapContent = uni.createMapContext("map",this);
							this.mapContent.includePoints({
								points:[
									{latitude:this.markers_originPlace[this.originIndex].latitude,longitude:this.markers_originPlace[this.originIndex].longitude},
									{latitude:this.markers_originPlace[this.destIndex].latitude,longitude:this.markers_originPlace[this.destIndex].longitude},
									{latitude:this.car_serving.latitude,longitude:this.car_serving.longitude}
								],
								padding:[50,50,50,50]
							})
							
						});
						

					},5000);
				}
			},
			//获取数据库中小车信息，并存储在this.car_serving中
			async getCarInfo(){
				let res = await db.collection("markers_cars").get()
				//console.log(res.result.data[0])
				if(this.car_id===1){
					this.car_serving = res.result.data[0].car_01
				}else if(this.car_id===2){
					this.car_serving = res.result.data[0].car_02
				}else if(this.car_id===3){
					this.car_serving = res.result.data[0].car_03
				}
				console.log(this.car_serving)
				
			},
			//更新map上的car
			updataMarkerCar(){
				this.mapContent = uni.createMapContext("map",this);
				this.mapContent.removeMarkers({
					markerIds:["111"]
				}),
				this.addMarker(this.car_serving)
			}
		}
		
	}
</script>

<style lang="scss">
	.leftSolt {
		display: flex;
		align-items: center;
	}

	.map {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: 100px;
	}

	.searchAddr {
		padding: 15rpx 20rpx;
	}

	.hint {
		padding: 15rpx 24rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.button {
		margin-left: 56rpx;
		margin-right: 56rpx;
	}
</style>