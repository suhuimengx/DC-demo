<template>
	<view>
		<!-- 1.顶部导航栏 -->
		<u-navbar title="订单详情" bgColor="#f2c7c0">
			<view class="u-nav-slot" slot="left">
				<u-icon name="arrow-left" size="24" @click="goBack"></u-icon>
				<u-line direction="column" :hairline="false" length="16" margin="0 8px" color="black"></u-line>
				<u-icon name="home" size="24" @click="goBackHome"></u-icon>
			</view>
		</u-navbar>
		<!-- 2.出发地、目的地展示框 -->
		<view class="Addr">
			<u--input :placeholder="columns[0][originId]" prefixIcon="map" :disabled="true" color="black"
				fontSize="20px" prefixIconStyle="font-size: 26px;color: #11262e"></u--input>
			<u-line direction="column" :hairline="false" length="16" margin="0 20px" color="gray" :dashed="true">
			</u-line>
			<u--input :placeholder="columns[0][destId]" prefixIcon="map-fill" :disabled="true" color="black"
				fontSize="20px" prefixIconStyle="font-size: 26px;color: #11262e"></u--input>
		</view>
		<!-- 3.选择出行数量需求 -->
		<view class="numDemand">
			<u--text color="#11262e" text="选择出行数量" size="40rpx"></u--text>
			<u-number-box v-model="numDemand" max=5 :integer="true" bgColor="#ffb6b9" buttonSize="35px"></u-number-box>
		</view>
		<!-- 4.选择是否立即出行 -->
		<view class="promptCheck">
			<text size="18px">是否立即出发？</text>
			<u-radio-group v-model="promptDecide" placement="row" size="20px" class="checkbox" @change="decideChange">
				<u-radio :customStyle="{marginRight: '30px'}" v-for="(item, index) in promptPickList" :key="index"
					:label="item.name" :name="item.name" shape="square" label-size="18px" activeColor="#ffb6b9">
				</u-radio>
			</u-radio-group>
		</view>
		<!-- 5.选择行程时间 -->
		<view class="timePicker">
			<!-- 选择出发时间 -->
			<u-datetime-picker ref="datetimePicker" :show="showDeparturePicker" v-model="DepartureTime" mode="datetime"
				:minDate="1672502400000" :formatter="formatter" @cancel="showDeparturePicker=false"
				@confirm="showDeparturePicker=false">
			</u-datetime-picker>
			<!-- 选择到达时间 -->
			<u-datetime-picker ref="datetimePicker" :show="showArrivalPicker" v-model="ArrivalTime" mode="datetime"
				:minDate="1672502400000" :formatter="formatter" @cancel="showArrivalPicker=false"
				@confirm="showArrivalPicker=false">
			</u-datetime-picker>
			<u-cell-group>
				<u-cell icon="clock" :isLink="true" size="large" @click="showDeparturePicker=true">
					<view slot="title" style="color: black;font-size: 16px;">
						出发时间：{{$u.timeFormat(DepartureTime, 'yyyy年mm月dd日 hh时MM分')}}
					</view>
				</u-cell>
				<u-cell icon="clock-fill" :isLink="true" size="large" @click="showArrivalPicker=true">
					<view slot="title" style="color: black;font-size: 16px;">
						到达时间：{{$u.timeFormat(ArrivalTime, 'yyyy年mm月dd日 hh时MM分')}}
					</view>
				</u-cell>
			</u-cell-group>
		</view>
		<!-- 6.出行等待时间限度选择 -->
		<view class="waitTimeSelector">
			<text style="margin-left: 36rpx;font-size: 42rpx;">选择可接受的出发等待时间~</text>
			<slider min="0" max="20" activeColor="#ffb6b9" block-color="#D25565" :show-value="true"
				@change="changeWaitTime">
			</slider>
		</view>
		<!-- 7.确定订单按钮 -->
		<view class="orderButton">
			<u-button text="确认订单" type="primary" icon="thumb-up" shape="circle" @click="confirmOrder" color="#e8627b"
				size="large"></u-button>
			<u-toast ref="uToast"></u-toast>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				originId: -1, //出发地id（需传输）
				destId: -1, //目的地id（需传输）
				numDemand: 1, //出行数量需求（需传输）
				columns: [
					["北京", "南京", "成都", "西安"]
				],
				//横向两端排列形式数据
				promptPickList: [{
						name: 'yes',
						disabled: false
					},
					{
						name: 'no',
						disabled: false
					}
				],
				promptDecide: 'no', //是否立即出发
				promptTravel: false, //是否立即出发
				waitTime: 0, //出发等待时间限度(需传输)
				showDeparturePicker: false, //控制出发时间选择器显示
				showArrivalPicker: false, //控制出发时间选择器显示
				DepartureTime: Number(new Date()), //出发时间（需传输）
				ArrivalTime: -1 //到达时间，确认订单时若为-1，则不予通过（需传输）
			};
		},
		onReady() {
			// 微信小程序需要用此写法
			this.$refs.datetimePicker.setFormatter(this.formatter)
		},
		onLoad(res) {
			console.log(res);
			this.originId = res.originId;
			this.destId = res.destId;
		},
		methods: {
			//返回上一级
			goBack() {
				uni.navigateBack();
			},
			//返回首页
			goBackHome() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			//出行状态改变响应
			decideChange() {
				if (this.promptDecide == 'yes') {
					this.promptTravel = true;
				} else if (this.promptDecide == 'no') {
					this.promptTravel = false;
				}
			},
			//格式化时间
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				}
				if (type === 'month') {
					return `${value}月`
				}
				if (type === 'day') {
					return `${value}日`
				}
				return value
			},
			//赋值等待时间
			changeWaitTime(res) {
				this.waitTime = res.detail.value
			},
			//确认订单触发事件
			confirmOrder() {
				if (this.ArrivalTime == -1) {
					this.$refs.uToast.show({
						message: '请选择最晚到达时间'
					})
				} else {
					let userid = uni.getStorageSync('userId').result;
					let item = {
						userId: userid, //用户id
						originId: this.originId, //出发地id
						destId: this.destId, //目的地id
						DepartureTime: this.DepartureTime, //预计出发时间，13位时间戳
						waitTime: this.waitTime, //出发时最长等待时间
						ArrivalTime: this.ArrivalTime, //最晚到达时间，13位时间戳
						numDemand: this.numDemand //出行数量需求
					}
					//上传到数据库，上传完成后自动生成订单id
					uniCloud.callFunction({
						name: 'UploadData',
						data: item
					}).then(res => {
						//将订单id添加到item对象中
						item.orderId = res.result.id;
						console.log(item);
						this.saveHistory(item);
					})
					uni.switchTab({
						url: "/pages/index/index"
					})
				}
			},
			//将出行数据存到本地缓存
			saveHistory(item) {
				let orderTime = Number(new Date());
				item.orderTime = orderTime;
				let historyArr = uni.getStorageSync('travelArr') || [];
				// console.log(historyArr);
				historyArr.unshift(item);
				uni.setStorageSync('travelArr', historyArr);
			}
		}
	}
</script>

<style lang="scss">
	.u-nav-slot {
		@include flex;
		align-items: center;
		justify-content: space-between;
		border-width: 0.5px;
		border-radius: 100px;
		border-color: $u-border-color;
		padding: 3px 7px;
		opacity: 0.8;
	}

	.Addr {
		margin-top: 100px;
		padding: 10rpx 20rpx;
	}

	.numDemand {
		display: flex;
		flex: auto;
		margin-top: 42rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.promptCheck {
		margin-left: 30rpx;
		margin-right: 30rpx;
		font-size: 42rpx;
		margin-top: 42rpx;

		.checkbox {
			margin-top: 18rpx;
		}
	}

	.timePicker {
		margin-top: 42rpx;
	}

	.waitTimeSelector {
		margin-top: 42rpx;
		touch-action: none;
	}

	.orderButton {
		margin-left: 56rpx;
		margin-right: 56rpx;
		margin-top: 42rpx;
	}
</style>