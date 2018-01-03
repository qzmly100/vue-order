<template>
	<div class="empty-container">
        <slot name="title"></slot>
    </div>
</template>
<script>
	let _export = {
        name:'Empty',
		data() {
			return {}
		},
		methods: {}
	};
	export default _export;
</script>
<style lang="scss" scoped type="text/css">
	.empty-container {
        margin-top: 100px;
        text-align: center;
        font-size: 17px;
    }
</style>
