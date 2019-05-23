/**
 * Created by DExtra on 2017/8/1.
 * Description：遍历Views集合，监听被交互的View的Viewpoint属性变化，把当前被交互的View的Viewpoint赋值给其他View完成同步。
 */
define([
        "esri/core/watchUtils"
    ],
    function (watchUtils) {
        /**
         * utility method that synchronizes the viewpoint of a view to other views
         * 工具方法，用于同步当前View和其他Views的Viewpoint
         */
        var synchronizeView = function(view, others) {
            others = Array.isArray(others) ? others : [others];

            var viewpointWatchHandle;
            var viewStationaryHandle;
            var otherInteractHandlers;
            var scheduleId;

            var clear = function() {//在交互的View发生变化时，要清空之前的View监听；在后面的synchronizeViews方法中会用到。
                if (otherInteractHandlers) {
                    otherInteractHandlers.forEach(function(handle) {
                        handle.remove();
                    });
                }

                viewpointWatchHandle && viewpointWatchHandle.remove();
                viewStationaryHandle && viewStationaryHandle.remove();
                scheduleId && clearTimeout(scheduleId);
                otherInteractHandlers = viewpointWatchHandle =
                    viewStationaryHandle = scheduleId = null;
            };

            var interactWatcher = view.watch('interacting,animation',
                function(newValue) {
                    if (!newValue) {
                        return;
                    }
                    if (viewpointWatchHandle || scheduleId) {
                        return;
                    }

                    // start updating the other views at the next frame
                    scheduleId = setTimeout(function() {
                        scheduleId = null;
                        viewpointWatchHandle = view.watch('viewpoint,extent',
                            function(newValue,oldValue, propertyName) {
                                    others.forEach(function(otherView) {
                                        if(propertyName==="viewpoint"){
                                            otherView.viewpoint = newValue;
                                        }
                                    });
                            });
                    }, 0);

                    // 当用户开始对其他View交互时，要停止监听
                    otherInteractHandlers = others.map(function(otherView) {
                        return watchUtils.watch(otherView,
                            'interacting,animation',
                            function(value) {

                                if (value) {
                                    clear();
                                }
                            });
                    });

                    // or stop when the view is stationary again
                    viewStationaryHandle = watchUtils.whenTrue(view,
                        'stationary', clear);
                });

            return {
                remove: function() {
                    this.remove = function() {};
                    clear();
                    interactWatcher.remove();
                }
            }
        };

        /**
         * utility method that synchronizes the viewpoints of multiple views
         */
        var synchronizeViews = function(views) {
            var self=this;
            this.views=views;
            var handles = init(this.views);

            function init(views){
                var handles = views.map(function(view, idx, views) {
                    var others = views.concat();//等价于复制views集合
                    others.splice(idx, 1);//移除当前的view
                    return synchronizeView(view, others);
                });
                return handles;
            }

            return {
                clear: function() {
                    this.clear = function() {};
                    handles.forEach(function(h) {
                        h.remove();
                    });
                    handles = null;
                },
                add:function(view){
                    this.clear();
                    self.views.push(view);
                    handles=init(self.views);
                },
            }
        }
        return synchronizeViews;
    });

