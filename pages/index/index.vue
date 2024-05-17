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
			<map style="width: 100%; height: 800rpx;" :latitude="map_center_latitude" :longitude="map_center_longitude" enable-satellite="true" id="map" :markers="markers_originPlace"></map>
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
		<u-toast ref="uToast"></u-toast>

	</view>
</template>

<script>
	export default {
		data() {
			return {
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
				markers:[
					{
						id:111,
						latitude: 32.113475,
						longitude: 118.960198,
						width:20,
						height:30
					},
					{
						id:222,
						latitude: 32.11355,
						longitude: 118.960198,
						width:20,
						height:30
					}
				],
				markers_originPlace:[],
				markers_originPlace:[
					{
						id:0,
						latitude:32.123396,
						longitude:118.95174,
						width:20,
						height:30,
						iconPath:"/static/icon-pick-up.png",
						label:{content: "0-宿舍区0",borderWidth: 1,borderColor: '#A84335',anchorX:-15,anchorY:0,bgColor:"#E6852C"}
					},
					{
						id:1,
						latitude:32.110129,
						longitude:118.96061,
						width:20,
						height:30,
						iconPath:"/static/icon-pick-up.png",
						label:{content: "1-南门",borderWidth: 1,borderColor: '#A84335',anchorX:-15,anchorY:0,bgColor:"#E6852C"}
					},
					{
						id:2,
						latitude:32.111454,
						longitude:118.962545,
						width:20,
						height:30,
						iconPath:"/static/icon-pick-up.png",
						label:{content: "2-行政南楼",borderWidth: 1,borderColor: '#A84335',anchorX:-15,anchorY:0,bgColor:"#E6852C"}
					},
					{
						id:3,
						latitude:32.113041,
						longitude:118.960575,
						width:20,
						height:30,
						iconPath:"/static/icon-pick-up.png",
						label:{content: "3-图书馆",borderWidth: 1,borderColor: '#A84335',anchorX:-15,anchorY:0,bgColor:"#E6852C"}
					},
					{
						id:4,
						latitude:32.110943,
						longitude:118.958681,
						width:20,
						height:30,
						iconPath:"/static/icon-pick-up.png",
						label:{content: "4-教学楼",borderWidth: 1,borderColor: '#A84335',anchorX:-15,anchorY:0,bgColor:"#E6852C"}
					}
				],
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
			this.addMarkers()
		},
		mounted() {
			//添加计时器，轮询方式更新小车位置
			if(this.timer){
				clearInterval(this.timer)
			}else{
				this.timer = setInterval(()=>{
					console.log("更新位置")
					uniCloud.callFunction({
						name:"getMarkers"
					}).then(res=>{
						this.markers = res.result.data[0].markers
						this.updateMarkers()
						console.log(this.markers)
					})
				},5000);
			}
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		methods: {
			//选择出发地后触发事件
			confirmOrigin(res) {
				console.log('confirmOrigin', res)
				this.showOrign = false;
				this.originIndex = res.indexs[0];
				this.originPlace = res.value[0];
				console.log('originIndex', this.originIndex)
			},
			//选择目的地后触发事件
			confirmDest(res) {
				console.log('confirmDest', res)
				this.showDest = false;
				this.destIndex = res.indexs[0];
				this.destPlace = res.value[0];
				console.log('destIndex', this.destIndex);
			},
			//跳转订单详情信息页面（页面detail）
			goDetail() {
				if (this.originIndex == -1 || this.destIndex == -1) {
					this.transferStatus = false;
					this.$refs.uToast.show({
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
			//在地图上添加上车点
			addMarkers(){
				this.mapContent = uni.createMapContext("map",this);
				this.mapContent.addMarkers({
					markers:this.markers,
				success:()=>{console.log("添加成功")}
				
				})
			},
			updateMarkers(){
				this.mapContent = uni.createMapContext("map",this);
				this.mapContent.removeMarkers({
					markerIds:["111","222"]
				}),
				this.mapContent.addMarkers({
					markers:this.markers
				})
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