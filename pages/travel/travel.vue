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
				<view>预计出发时间: {{$u.timeFormat(item.DepartureTime, 'yyyy年mm月dd日 hh时MM分')}}</view>
				<view>最晚到达时间: {{$u.timeFormat(item.ArrivalTime, 'yyyy年mm月dd日 hh时MM分')}}</view>
				<view>最长出行等待时间: {{item.waitTime}}min</view>
				<view>出行数量需求: {{item.numDemand}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				travelArr: [],
				columns: [
					["北京", "南京", "成都", "西安"]
				],
			};
		},
		onLoad() {
			this.getHistory();
		},
		onInit() {
			this.getHistory();
		},
		onShow() {
			this.getHistory();
			console.log(this.travelArr);
		},
		methods: {
			getHistory() {
				this.travelArr = uni.getStorageSync('travelArr');
			}
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