<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                opt: {},
                config: '',
                user: ''
            };
        },
        beforeCreate() {

        },
        mounted() {

        }
    };
</script>

<style lang="scss">

@import "./common/styles/main.scss";

@import './assets/css/pipeSetting_sites.scss';
</style>
