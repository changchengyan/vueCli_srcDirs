<template>
<div id="test">
    <h1>我是 test组件</h1>
</div>
</template>

        
<script>
export default {
    props: ["test"],
    components: {

    },
    data() {
        return {
            count: 0
        }
    },
    methods: {
        test(val) {

        }
    },
    filters: {
        test(val) {
            return val
        }
    },
    mounted() {

    },
    watch: {
        test: {
            handler(newValue, oldValue) {
                console.log(newValue, oldValue)
            },
            immediate: true,
            deep: true
        }
    },
    created() {

    }
}
</script>

        
<style lang="scss" scoped>
#test {
    width: 100%;
    height: 100%;
}
</style>
