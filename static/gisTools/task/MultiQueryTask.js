/**
 * Created by DExtra on 2017-12-19 11:20:33.
 * 多查询任务，封装了QueryTask，可以同时开启多个查询任务，并返回结果
 */
define([
        "esri/core/Accessor",
        "esri/tasks/QueryTask",
    ],
    function (Accessor,QueryTask) {
        var MultiQueryTask=Accessor.createSubclass([],{
            declaredClass: "dextra.task.MultiQueryTask",

            /**
             * 用查询参数执行查询，返回一个featureSet数组
             * @method execute
             * @params {Array<Query>} params 查询参数
             * @return {Array<featureSet>} 查询结果，参照arcgis js 文档
             */
            execute:function(params){
                return this._reflectExecute(params,"execute")
            },

            /**
             * 用查询参数执行查询，返回一个整数数组
             * @method executeForCount
             * @params {Array<MultiQuery>} params 多查询参数
             * @return {Array<number>} 查询结果，参照arcgis js 文档
             */
            executeForCount(params){
                return this._reflectExecute(params,"executeForCount")
            },

            /**
             * 用查询参数执行查询，返回一个对象（包含count和extent）的数组，
             * @method executeForExtent
             * @params {Array<MultiQuery>} params 多查询参数
             * @return {Array<object>}查询结果，参照arcgis js 文档
             */
            executeForExtent(params){
                return this._reflectExecute(params,"executeForExtent")
            },

            /**
             * 用查询参数执行查询，返回一个包含id数组的数组
             * @method executeForIds
             * @params {Array<MultiQuery>} params 多查询参数
             * @return {Array<Array<ObjectId>>}查询结果，参照arcgis js 文档
             */
            executeForIds(params){
                return this._reflectExecute(params,"executeForIds")
            },

            _reflectExecute:function(params,method){
                var queryTasks = [];
                for(let i=0;i<params.length;i++){
                    var param=params[i];
                    var task=new QueryTask({
                        url: param.url,
                        requestOptions: param.requestOptions
                    });
                    var fn=task[method];
                    if(typeof fn === 'function') {
                        queryTasks.push(fn.call(task,param));
                    }
                }
                return Promise.all(queryTasks);
            }
        });

        return MultiQueryTask;
    });
