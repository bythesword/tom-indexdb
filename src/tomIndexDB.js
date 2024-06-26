import * as zip from "@zip.js/zip.js";
import { md5 } from "./md5/md5";
class TomIDB {
  constructor() {
    this.url
    this.request;
    this.db;
    this.storeObject = "CM";
    this.defaultObject;
    // this.init();
    this.MD5 = md5;
    return this;
  }


  /**
   * 
   * @param {*} url :database name ,
   * @param {*} storeObject : name of store object ,default =CM
   * @param {*} useMd5 : flag of  database name MD5 ,boolean
   * @returns 
   */
  async open(url, storeObject = "CM", useMd5 = true) {
    let scope = this;
    if (useMd5 === false) {
      this.dbName = url;
    } else {
      this.dbName = this.MD5(url);//dbName;
    }
    this.url = url;
    this.storeObject = storeObject;
    this.url = url;
    return new Promise((resolve, reject) => {
      scope.request = window.indexedDB.open(this.dbName, 4);
      scope.request.onupgradeneeded = function (event) {
        var db = event.target.result;
        db.onerror = function (event) {
          console.log('数据库打开错误')
        };
        var objectStore = db.createObjectStore(storeObject, { keyPath: "name" });
        objectStore.createIndex("name", "name", { unique: false });
        scope.objectStore = objectStore;
      };
      scope.request.onsuccess = function () {
        // console.log('数据库打开成功')
        scope.db = scope.request.result;
        scope.defaultObject = scope.db.transaction([storeObject], "readwrite").objectStore(storeObject);
        resolve(true);
      };
      scope.request.onerror = function () {
        console.log('数据库打开错误')
        reject(false)
      }
    });
  }
  async close() {
    this.request.result.close()
  }


  /**
   * 增加数据
   * @param {*} value ,数据，任意
   * @param {*} key ，默认=数据库名称，可以单独设定
   * @returns 
   */
  async add(value, key = false) {
    let scope = this;
    let a = await new Promise((resolve, reject) => {
      let request = this.db
        .transaction([scope.storeObject], "readwrite")
        .objectStore(scope.storeObject)
        // let request = scope.storeObject
        .add({ "name": key === false ? this.dbName : key, "conent": value, "originName": key === false ? this.dbName : key });
      request.onsuccess = function (event) {
        resolve(true);
      };
      request.onerror = function (event) {
        console.log('数据写入失败');
        reject(false)
      }
    })
  }
  // async add(value, key = false) {
  //   let scope = this;
  //   return new Promise((resolve, reject) => {
  //     // let request = this.db
  //     //   .transaction([scope.url], "readwrite")
  //     //   .objectStore(scope.url)
  //     let request = scope.storeObject
  //       .add({ "name": key === false ? this.dbName : key, "conent": value, "originName": key === false ? this.dbName : key });
  //     request.onsuccess = function (event) {
  //       resolve(true);
  //     };
  //     request.onerror = function (event) {
  //       console.log('数据写入失败');
  //       reject(false)
  //     }
  //   })
  // }
  /**
   * 获取数据
   * @param {*} key ：default = false（同数据库名称），获取key对应的数据
   * @returns 
   */
  async get(key = false) {
    if (key === false)
      key = this.dbName;
    let scope = this;
    return new Promise((resolve, reject) => {
      let request = this.db
        .transaction([scope.storeObject], "readwrite")
        .objectStore(scope.storeObject)
        // let request = scope.storeObject
        .get(key);
      request.onsuccess = function (event) {
        let conent;
        if (request.result) conent = request.result.conent;
        else conent = false;
        resolve(conent);
      };
      request.onerror = function (event) {
        console.log('数据read失败');
        reject(false)
      }
    })
  }
  /**
   * 检查是否存在数据
   * @param {*} key ：default = false（同数据库名称），获取key对应的数据
   * @returns 
   */
  async check(key = false) {
    if (key === false)
      key = this.dbName;
    let scope = this;
    let check = await new Promise((resolve, reject) => {
      let request = this.db
        .transaction([scope.storeObject], "readwrite")
        .objectStore(scope.storeObject)
        // let request = scope.storeObject
        .openCursor();
      request.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          let conent;
          if (cursor.value.name == key) {
            resolve(true);
          }
          else conent = false;
          cursor.continue();
          return;
        } else {
          resolve(false);
        }

      };
      request.onerror = function (event) {
        console.error('数据read失败');
        reject(false)
      }
    })
    return check;
  }
  /**
   * 获取所有记录
   * @returns []
   *    */
  async getAll() {
    let scope = this;
    return new Promise((resolve, reject) => {
      let request = this.db
        .transaction([scope.storeObject], "readwrite")
        .objectStore(scope.storeObject)
        // let request = scope.storeObject
        .getAll();
      request.onsuccess = function (event) {
        resolve(request.result);
      };
      request.onerror = function (event) {
        console.error('数据read失败');
        reject(false)
      }
    })
  }
  /**
   * 清楚所有记录
   * @returns boolean
   */
  async clear() {
    let scope = this;
    let a = await new Promise((resolve, reject) => {
      let request = this.db
        .transaction([scope.storeObject], "readwrite")
        .objectStore(scope.storeObject)
        // let request = scope.storeObject
        .clear();
      request.onsuccess = function (event) {
        resolve(true);
      };
      request.onerror = function (event) {
        console.error('clear fail');
        reject(false)
      }
    })
  }
  /**
   * 删除指定的key
   * @param {*} key 
   * @returns 
   */
  async delete(key = false) {
    if (key === false)
      key = this.dbName;
    let scope = this;
    let a = await new Promise((resolve, reject) => {
      let request = this.db
        .transaction([scope.storeObject], "readwrite")
        .objectStore(scope.storeObject)
        // let request = scope.storeObject
        .delete(key);
      request.onsuccess = function (event) {
        resolve(true);
      };
      request.onerror = function (event) {
        console.error('delete  fail');
        reject(false)
      }
    })
  }

  /**
   * 更新指定的可以
   * @param {*} value 
   * @param {*} key ：default = false（同数据库名称），获取key对应的数据 
   * @returns 
   */
  async update(value, key = false) {
    let keyMD5;
    if (key === false)
      keyMD5 = this.dbName;
    let ok = await this.check();
    if (ok)
      await this.delete(keyMD5);
    if (key)
      await this.add(value, key);
    else
      await this.add(value);
  }

}

export { TomIDB };


export async function getUrl(url) {
  let zip = false;
  if (url.indexOf(".zip") != "-1") {
    zip = true;
  }
  let text = await new Promise((resolve, reject) => {
    let xml = new XMLHttpRequest();
    xml.open("GET", url);
    if (zip === true) {
      xml.responseType = 'blob';
    }
    xml.send();
    xml.onload = () => {
      console.log("OK", xml);
      if (xml.status == 200) {
        let data;
        if (zip === true) {
          // data = new Uint8Array(await xml.response.arrayBuffer());
          // resolve(data)
          var blob = xml.response;
          // 将 blob 数据读取为 ArrayBuffer
          var reader = new FileReader();
          reader.onload = function (e) {
            // 此时 e.target.result 就是 ArrayBuffer 对象
            var arrayBuffer = e.target.result;

            // 处理 arrayBuffer 数据
            // console.log(arrayBuffer);
            resolve(arrayBuffer);
          };

          // 以 ArrayBuffer 形式读取 blob 数据
          reader.readAsArrayBuffer(blob);
          // // resolve(xml.response)
        }
        else {
          data = xml.response;
          resolve(data);
        }

      } else if (xml.status == 404) {
        reject(new Error(xml.status));
      } else {
        reject(new Error("error"));
      }
    };
  });
  return text;
}

export async function getData(url) {

  let tom = new TomIDB();
  let okIDB = await tom.open(url)
  let okMesh = false;
  let data, newData;
  if (okIDB) {
    okMesh = await tom.check();
    console.log(okMesh)
  }

  if (okMesh && okIDB) {
    data = await tom.get();
  }
  else if (okMesh === false && okIDB) {
    // let b = await tom.update("data");
    data = await getUrl(url);
    let b = await tom.update(data);
    console.log(b)
  }
  else {

  }

  if (url.indexOf(".zip") != "-1") {
    const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(data)));
    // const zipReader = new zip.ZipReader(new zip.BlobReader(data));
    const entries = await zipReader.getEntries();
    let filenames = [];
    for (let i in entries) {
      if (entries[i].filename.indexOf(".json") != "-1") {
        filenames.push(i);
      }
    }
    if (filenames.length > 0) {
      newData = await entries[filenames[0]].getData(new zip.TextWriter());

    }
    else {
      console.error("未发现.json文件");
    }
    return newData;
  }
  else {
    return data
  }
  return false;



}
