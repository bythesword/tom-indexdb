import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { cloudIdb } from "./cloudidb";

let that;
class idbzip {

    constructor() {
        that = this;
        this.idb = new cloudIdb("idbZIP", this.test);
        // this.test();
    }

    test() {
        const promise = new JSZip.external.Promise(function (resolve, reject) {
            let zipName = "./1.zip".split("/").pop();
            that.idb.read(zipName, function (cacheData) {
                if (cacheData == false) {
                    JSZipUtils.getBinaryContent("./1.zip", function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            let a2b = that.arrayBufferToBase64(data);
                            // let b2a = that.base64ToUint8Array(a2b).buffer;
                            // console.log("this is raw from zip ", data, b2a)
                            that.idb.add(zipName, a2b);
                            console.log("The data loads from network");
                            resolve(data);
                        }
                    });
                }
                else {
                    console.log("The data loads from cache");
                    resolve(that.base64ToUint8Array(cacheData).buffer);
                }
            });
        });
        promise.then(JSZip.loadAsync)                     // 2) chain with the zip promise
            .then(function (zip) {
                return zip.file("1.txt").async("string"); // 3) chain with the text content promise
            })
            .then(function success(text) {                    // 4) display the result
                console.log(text);
            }, function error(e) {
                console.log(e);
            });

    }

    arrayBufferToBase64(buffer) {
        var binary = "";
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }



    base64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

}

export { idbzip };