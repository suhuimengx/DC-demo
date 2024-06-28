<template>
	<view>
		
		<!-- 1.顶部导航栏 -->
		<u-navbar bgColor="#f2c7c0" title="出行行程">
			<view slot="left" class="leftSolt">
				<u-icon name="calendar-fill" size="32" color="#000000"></u-icon>
			</view>
		</u-navbar>
		
		<!-- 2.行程信息 -->
		<view class="travelInfo">
			<view v-for="item in travelArr" :key="item.orderId" class="itemInfo">
				<view style="margin-bottom: 18rpx;">下单时间-{{$u.timeFormat(item.orderTime, 'mm月dd日 hh时MM分ss秒')}}</view>
				<view>出发地: {{columns[0][item.originId]}}</view>
				<view>目的地: {{columns[0][item.destId]}}</view>
				<view>乘坐车编号: {{item.car_id}}</view>
				<view>预计出发时间: {{$u.timeFormat(item.DepartureTime, 'yyyy年mm月dd日 hh时MM分')}}</view>
				<view>最晚到达时间: {{$u.timeFormat(item.ArrivalTime, 'yyyy年mm月dd日 hh时MM分')}}</view>
				<view>最长出行等待时间: {{item.waitTime}}min</view>
				<view>出行数量需求: {{item.numDemand}}</view>
			</view>
		</view>
		<button @click="getDbInfo">test</button>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				travelArr: [],
				columns: [
					["0-宿舍区0", "1-南门", "2-行政南楼", "3-图书馆", "4-教学楼", "5-实验楼", "6-体育馆", "7-活动中心", "8-宿舍区1", "9-宿舍区2",
						"10-快递中心", "11-校医院", "12-九食堂", "13-气象楼", "14-环境学院", "15-信息中心", "16-游泳馆", "17-美术馆", "18-宿舍区3",
						"19-宿舍区4", "20-宿舍区5", "21-医学院", "22-建设银行", "23-现工院"
					]
				],
			};
		},
		onLoad() {
			this.checkLogin()
			this.getDbInfo();
		},
		onInit() {
			this.checkLogin()
			this.getDbInfo();
		},
		onShow() {
			this.checkLogin()
			this.getDbInfo();
			console.log(this.travelArr);
		},
		methods: {
			getDbInfo(){
				db.collection("share_hiking_database").where('userid==$cloudEnv_uid').get().then((res)=>{
					console.log(res.result.data)
					this.travelArr = res.result.data
				})
			},
			//辅助函数，判断用户未登录时跳转登录页面
			checkLogin(){
				let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo')||{}
				if(!hostUserInfo._id){
					uni.navigateTo({
						url:"/uni_modules/uni-id-pages/pages/login/login-withpwd?showtoastFlag=true"
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.leftSolt {
		display: flex;
		align-items: center;
	}

	.travelInfo {
		margin-top: 100px;

		.itemInfo {
			border: 2px solid #999497;
			margin: 24rpx 24rpx;
			background: #f2ebee;
		}
	}
</style>