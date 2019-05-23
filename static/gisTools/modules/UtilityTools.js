/**
 * 一些通用的工具
 * Created by DExtra on 2017-12-8 15:39:26
 * @module UtilityTools
 */
define([
        "dojo/string",
        "esri/geometry/support/normalizeUtils",
],
    function (string,normalizeUtils) {
        var Tools = {
            ConvertDigitalToDegrees: ConvertDigitalToDegrees,
            ConvertDegreesToDigital:ConvertDegreesToDigital,
            Coord2Screen:Coord2Screen
        }


        /**
         * 经纬度（10进制）转度分秒
         * @method ConvertDigitalToDegrees
         * @param {float} digitalDegree 十进制经纬度
         * @return {String} 度分秒经纬度
         */
        function ConvertDigitalToDegrees(digitalDegree) {
            var num = 60;
            var degree = parseInt(digitalDegree);
            var temp = (digitalDegree - degree) * num;
            var minute = parseInt(temp);

            var second = parseInt((temp - minute) * num);
            var degrees = string.substitute("${degree}°${minute}′${second}″", {
                degree: degree,
                minute: minute,
                second: second
            });
            return degrees;
        }

        /**
         * 度分秒转经纬度（10进制）
         * @method ConvertDegreesToDigital
         * @param {String} degrees 度分秒
         * @return {float} 十进制经纬度
         */
        function ConvertDegreesToDigital(degrees){
            var num=60;
            var digitalDegree=0.0;
            var d=degrees.indexOf("°");
            if(d<0){
                return digitalDegree
            }
            var degree=degrees.substring(0,d);
            digitalDegree+=parseFloat(degree);
            var m = degrees.indexOf('′');           //分的符号对应的 Unicode 代码为：2032[1]（六十进制），显示为′。
            if (m < 0)
            {
                return digitalDegree;
            }
            var minute = degrees.substring(d + 1, m - d - 1);
            digitalDegree += ((parseFloat(minute)) / num);

            var s = degrees.indexOf('″');           //秒的符号对应的 Unicode 代码为：2033[1]（六十进制），显示为″。
            if (s < 0)
            {
                return digitalDegree;
            }
            var second = degrees.substring(m + 1, s - m - 1);
            digitalDegree += (parseFloat(second) / (num * num));
            return digitalDegree;
        }

        /**
         * 经纬度转换为屏幕坐标
         * @method Coord2Screen
         * @param {View} view 视图
         * @return {Point} 坐标点
         */
        function Coord2Screen(view,point){

            return normalizeUtils.normalizeCentralMeridian([view.extent]).then(function(extents){
                var resolution =  view.extent.width /  view.width;

                var geo_center=extents[0].center;
                var screen_center={
                    x:document.body.clientWidth/2,
                    y:document.body.clientHeight/2,
                }
                var screen_x=screen_center.x+Math.round((point.x-geo_center.x)/resolution+0.5)
                var screen_y=screen_center.y-Math.round((point.y-geo_center.y)/resolution+0.5)

                return{
                    x:screen_x,
                    y:screen_y
                }
            },function(error){
                console.log(error)
            });
        }

        return Tools;
    });


