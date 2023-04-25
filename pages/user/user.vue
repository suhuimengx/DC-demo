<template>
	<view>
		<!-- 1.顶部导航栏 -->
		<u-navbar bgColor="#f2c7c0" title="我的">
			<view slot="left" class="leftSolt">
				<u-icon name="calendar-fill" size="32" color="#000000"></u-icon>
			</view>
		</u-navbar>
		<!-- 清除缓存按钮 -->
		<button style="margin-top: 200px;" color="#d498b3" type="primary" @click="clearCache">清除缓存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			clearCache() {
				uni.removeStorageSync('travelArr')
			}
		}
	}
</script>

<style lang="scss">

</style>