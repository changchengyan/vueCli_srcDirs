<template>
    <div id="funcTools">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'funcTools',
        data(){
            return{

            };
        }
    };
</script>

<style scoped lang="scss">
#funcTools{
    height: 38px;
    display: flex;
    justify-content: flex-start;
    background: #fff;
}
</style>