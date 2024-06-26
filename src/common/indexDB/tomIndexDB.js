
class TomIDB {
    constructor(storeObject ,dbName = "CM", ) {

        this.request;
        this.DBName=dbName;
        this.IDB;
        this.defaultObject = storeObjectObject;        
        return this;
    }


    async init(name, callback) {
        let that = this;

        var request = window.indexedDB.open(name);
        let open = await new Promise(resolve => {
            request.onsuccess = function () {
                resolve(new Cesium.Texture({
                    context: context,
                    width: img.width,
                    height: img.height,
                    pixelFormat: Cesium.PixelFormat.RGBA,
                    pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
                    source: img,
                    sampler: new Cesium.Sampler({
                        minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
                        magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
                    })
                })
                )
            }
        })


        //    let  await new Promise(resolve => {
        //         img.onload = function () {
        //             resolve(new Cesium.Texture({
        //                 context: context,
        //                 width: img.width,
        //                 height: img.height,
        //                 pixelFormat: Cesium.PixelFormat.RGBA,
        //                 pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
        //                 source: img,
        //                 sampler: new Cesium.Sampler({
        //                     minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
        //                     magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
        //                 })
        //             })
        //             )
        //         }
        //     })
    }
}

export { TomIDB };
