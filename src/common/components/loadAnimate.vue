<template>
<div id="loadAnimate" v-if="showAnimate">
    <div class="wrap-loader" id="wrap_loader">
        <div class="loader">
            <div class="loader-inner pacman">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
/**
 *  post成功之前的缓动动画  
 */

export default {
    props:["showAnimate"],
    data(){
        return{

        }
    }

}
</script>

<style lang="scss" scoped>
@-webkit-keyframes rotate_pacman_half_up {
    0% {
        -webkit-transform: rotate(270deg);
        transform: rotate(270deg);
    }

    50% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }

    100% {
        -webkit-transform: rotate(270deg);
        transform: rotate(270deg);
    }
}

@keyframes rotate_pacman_half_up {
    0% {
        -webkit-transform: rotate(270deg);
        transform: rotate(270deg);
    }

    50% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }

    100% {
        -webkit-transform: rotate(270deg);
        transform: rotate(270deg);
    }
}

@-webkit-keyframes rotate_pacman_half_down {
    0% {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
    }

    50% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
    }
}

@keyframes rotate_pacman_half_down {
    0% {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
    }

    50% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
    }
}

@-webkit-keyframes pacman-balls {
    75% {
        opacity: 0.7;
    }

    100% {
        -webkit-transform: translate(-100px, -6.25px);
        transform: translate(-100px, -6.25px);
    }
}

@keyframes pacman-balls {
    75% {
        opacity: 0.7;
    }

    100% {
        -webkit-transform: translate(-100px, -6.25px);
        transform: translate(-100px, -6.25px);
    }
}

#loadAnimate {
    width: 100%;
    height: 100%;

    .wrap-loader {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1000000;

        .loader {
            display: inline-block;
            width: 100px;
            height: 130px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -50px;
            margin-top: -50px;
    
            .pacman {
                position: relative;
                width: 100px;
                height: 100px;

                &>div:nth-child(2) {
                    -webkit-animation: pacman-balls 1s 0s infinite linear;
                    animation: pacman-balls 1s 0s infinite linear;
                }

                &>div:nth-child(3) {
                    -webkit-animation: pacman-balls 1s 0.33s infinite linear;
                    animation: pacman-balls 1s 0.33s infinite linear;
                }

                &>div:nth-child(4) {
                    -webkit-animation: pacman-balls 1s 0.66s infinite linear;
                    animation: pacman-balls 1s 0.66s infinite linear;
                }

                &>div:nth-child(5) {
                    -webkit-animation: pacman-balls 1s 0.99s infinite linear;
                    animation: pacman-balls 1s 0.99s infinite linear;
                }

                &>div:first-of-type {
                    width: 0px;
                    height: 0px;
                    border-right: 60px solid transparent;
                    border-top: 60px solid #63d1fd;
                    border-left: 60px solid #63d1fd;
                    border-bottom: 60px solid #63d1fd;
                    border-radius: 60px;
                    -webkit-animation: rotate_pacman_half_up 0.5s 0s infinite;
                    animation: rotate_pacman_half_up 0.5s 0s infinite;
                }

                &>div:nth-child(2) {
                    width: 0px;
                    height: 0px;
                    border-right: 60px solid transparent;
                    border-top: 60px solid #63d1fd;
                    border-left: 60px solid #63d1fd;
                    border-bottom: 60px solid #63d1fd;
                    border-radius: 60px;
                    -webkit-animation: rotate_pacman_half_down 0.5s 0s infinite;
                    animation: rotate_pacman_half_down 0.5s 0s infinite;
                    margin-top: -120px;
                }

                &>div:nth-child(3),
                &>div:nth-child(4),
                &>div:nth-child(5),
                &>div:nth-child(6) {
                    background-color: #63d1fd;
                    width: 15px;
                    height: 15px;
                    border-radius: 100%;
                    margin: 2px;
                    width: 10px;
                    height: 10px;
                    position: absolute;
                    -webkit-transform: translate(0, -6.25px);
                    -ms-transform: translate(0, -6.25px);
                    transform: translate(0, -6.25px);
                    top: 60px;
                    left: 200px;
                }
            }
        }

    }
}

@-webkit-keyframes cube-transition {
    25% {
        -webkit-transform: translateX(50px) scale(0.5) rotate(-90deg);
        transform: translateX(50px) scale(0.5) rotate(-90deg);
    }

    50% {
        -webkit-transform: translate(50px, 50px) rotate(-180deg);
        transform: translate(50px, 50px) rotate(-180deg);
    }

    75% {
        -webkit-transform: translateY(50px) scale(0.5) rotate(-270deg);
        transform: translateY(50px) scale(0.5) rotate(-270deg);
    }

    100% {
        -webkit-transform: rotate(-360deg);
        transform: rotate(-360deg);
    }
}

@keyframes cube-transition {
    25% {
        -webkit-transform: translateX(50px) scale(0.5) rotate(-90deg);
        transform: translateX(50px) scale(0.5) rotate(-90deg);
    }

    50% {
        -webkit-transform: translate(50px, 50px) rotate(-180deg);
        transform: translate(50px, 50px) rotate(-180deg);
    }

    75% {
        -webkit-transform: translateY(50px) scale(0.5) rotate(-270deg);
        transform: translateY(50px) scale(0.5) rotate(-270deg);
    }

    100% {
        -webkit-transform: rotate(-360deg);
        transform: rotate(-360deg);
    }
}

.cube-transition {
    position: relative;
    -webkit-transform: translate(-25px, -25px);
    -ms-transform: translate(-25px, -25px);
    transform: translate(-25px, -25px);
}

.cube-transition>div {
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #63d1fd;
    -webkit-animation: cube-transition 1.6s 0s infinite ease-in-out;
    animation: cube-transition 1.6s 0s infinite ease-in-out;
}

.cube-transition>div:last-child {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
}

@-webkit-keyframes spin-rotate {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    50% {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes spin-rotate {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    50% {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
</style>
