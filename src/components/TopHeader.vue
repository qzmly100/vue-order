<template>
	<!--头部组件 start-->
	<header v-if="show" class="TopHeader" :class="{'android':system == 'Android'}">
		<div class="header-left">
			<slot name="left">
			</slot>
		</div>
		<div class="title" :class="{'white': white == 'white' }">
			{{title}}
		</div>
		<div class="header-right">
			<slot name="right">
			</slot>
		</div>
	</header>
	<!--头部组件 end-->
</template>
<script>	
	let _export = {
		data() {
			return {

			}
		},
		props: ['title', 'show','system','white'],
		methods: {}
	};
	export default _export;
</script>
<style lang="scss" scoped type="text/css">
	.TopHeader {
		height: 64px;
		padding-top: 20px;
		font-size: 17px;
		line-height: 44px;
		text-align: center;
		width: 100%;
		box-shadow: 0 1px 0px #c1c1c1;
		&.android {
			height: 44px;
			padding-top: 0;
		}
		/*color: #fff;*/
		/*background-color: #F37938;*/
		.header-left,
		.header-right {
			height: 100%;
			width: 20%;
			
		}
		.header-left {
			$dec: left;
			float: $dec;
			text-align: $dec;
		}
		.header-right {
			$dec: right;
			float: $dec;
			text-align: $dec;
			padding-#{$dec}: 15px;
			padding-top: 5px;
			a.server-TEL {
				display: inline-block;
				width:22px;
				height: 22px;
				background: url('../../static/images/server-TEL.png');
				background-size: 22px;
			}
		}
		.title {
			height: 100%;
			float: left;
			width: 60%;
			text-align: center;
			font-size: 17px;
			color:#4a4a4a;
			&.white {
				color: #FFF;
			}
		}
	}
</style>
