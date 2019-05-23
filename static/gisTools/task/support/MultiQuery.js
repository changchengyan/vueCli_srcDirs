/**
 * Created by DExtra on 2017-12-19 11:20:33.
 * 多查询任务参数，继承esri/tasks/support/Query
 */
define([
        "esri/core/Accessor",
        "esri/tasks/support/Query",
    ],
    function (Accessor,Query) {


        var MultiQuery=Query.createSubclass({
            declaredClass: "dextra.task.support.MultiQuery",

            properties: {
                url:{
                    value:null,
                },
                requestOptions: {
                    value:null,
                }
            },
        });

        return MultiQuery;
    });
