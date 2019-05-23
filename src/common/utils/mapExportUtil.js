/**
 * @description 导出2d 地图图片.
 * @author wangsl.
 * */
export default {
    //
    exportMap(loader, view, printUrl) {
        //
        let promise = new Promise(/* executor */ function (resolve, reject) {
            try {
                loader.loadModules(["esri/tasks/PrintTask",
                    "esri/tasks/support/PrintParameters",
                    "esri/tasks/support/PrintTemplate",])
                    .then(([PrintTask, PrintParameters, PrintTemplate]) => {
                            //
                            // let printUrl = 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task';
                            var printTask = new PrintTask({
                                url: printUrl,
                                requestOptions:{
                                    method:'post',
                                    timeout:15000
                                }
                            });
                            //
                            // let canvas=
                        // console.log(view);
                            let template = new PrintTemplate({
                                format: 'png8',
                                layout: 'map-only',
                                exportOptions: {
                                    width: view.width,
                                    height: view.height,
                                    dpi: 96
                                }
                            });
                            let printParams = new PrintParameters({
                                //
                                view: view,
                                template: template
                            });

                            printTask.execute(printParams).then(function (results) {
                                //
                                // console.log(results.url);
                                var image = document.createElement('img');
                                //
                                var canvas = document.createElement('canvas');
                                //
                                var context = canvas.getContext('2d');
                                image.setAttribute('crossOrigin', 'anonymous');
                                image.src = results.url;
                                image.addEventListener('load', function (event) {
                                    canvas.width = image.width;
                                    canvas.height = image.height;
                                    // document.body.appendChild(image);
                                    context.drawImage(image, 0, 0, image.width, image.height);
                                    //
                                    //
                                    resolve(canvas.toDataURL('image/png'));
                                    // console.log(canvas.toDataURL());
                                });
                                //
                            }).catch(function (error) {
                                //
                                console.log(error.message);
                            });
                        }
                    ).catch((error) => {
                    //
                    console.log(error.message);
                });
            } catch (error) {
                //
                reject(error)
            }
        });

        return promise;

    },
};