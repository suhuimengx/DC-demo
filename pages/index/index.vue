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
			<map style="width: 100%; height: 800rpx;" :latitude="latitude" :longitude="longitude"></map>
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
				mapSrc: 'https://cdn.uviewui.com/uview/album/1.jpg',
				showOrign: false,
				showDest: false,
				originIndex: -1, //出发地id
				destIndex: -1, //目的地id
				originPlace: "请选择出发地",
				destPlace: "请选择目的地",
				transferStatus: false, //判断地址是否完成选择
				columns: [
					["北京", "南京", "成都", "西安"]
				],
				latitude: 39.909,
				longitude: 116.39742
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
						console.log(openid);
						uni.setStorageSync('userId', openid);
					})
				}
			})
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