
class cloudIdb {
    constructor(dbName = "cm", defaultObject = "CM", callback = false) {

        this.request;
        this.db_IndexDB;
        this.localIDB;
        this.defaultObject = defaultObject;
        let log = function (msg) { console.log(msg); };
        this.init(dbName, callback == false ? log : callback);
    }

    init(name, callback) {
        let that = this;
        if (name == false) {
            callback(false);
            return;
        }
        var request = window.indexedDB.open(name);
        request.onerror = function (event) {
            ////console.log('数据库打开报错');
            // that.cache=false;
            callback(false);
        };

        request.onsuccess = function (event) {
            that.db_IndexDB = request.result;
            callback(true);
            // that.cache=true;
            //console.log('数据库打开成功');

            // read();
            // readAll();
        };
        request.onupgradeneeded = function (event) {
            that.db_IndexDB = event.target.result;

            if (!that.db_IndexDB.objectStoreNames.contains(that.defaultObject,)) {

                this.objectStore = that.db_IndexDB.createObjectStore(that.defaultObject, {
                    keyPath: "name",
                });
                this.objectStore.createIndex("iname", "name", { unique: false });
            }
            callback(this.objectStore ? true : false);

            // that.cache=true;
        };
    }

    add(defaultObject, name, obj, fun) {
        for (let i in obj) {

            if (typeof obj[i] != "undefined" && typeof obj[i].fun != "undefined") {
                return;
            }
        }
        var request = this.db_IndexDB
            .transaction([defaultObject], "readwrite")
            .objectStore(defaultObject)
            .add({ name: name, what: obj });

        request.onsuccess = function (event) {
            //console.log('数据写入成功');
            fun(true, event);
        };
        request.onerror = function (event) {
            //console.log('数据写入失败');
            fun(false, event);
        };
    }

    readAll(fun) {
        var objectStore = this.db_IndexDB.transaction("CM").objectStore("CM");

        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;

            if (cursor) {
                ////console.log('Id: ' + cursor.key);
                ////console.log('Name: ' + cursor.value.name);
                ////console.log('what: ' + cursor.value.what);
                // if (cursor.value.name == "bridge") {
                //     $(fun).callBack(cursor.value.what);
                //     return 1;
                // }
                cursor.continue();
            } else {
                //console.log('没有更多数据了！');
                $(fun).callBack(false);
            }
        };
    }
    getCount(fun) {
        try {
            var objectStore = this.db_IndexDB.transaction("CM").objectStore("CM");
            const myIndex = objectStore.index("iname");
            const countRequest = myIndex.count();
            countRequest.onsuccess = () => {
                console.log("index count is :" + countRequest.result);
                fun(countRequest.result);
            };
            // return countRequest.result;
        }
        catch (err) {
            return false;
        }
    }
    read(defaultObject, name, fun) {
        try {
            var transaction = this.db_IndexDB.transaction([defaultObject]);
            var objectStore = transaction.objectStore(defaultObject);
            var request = objectStore.get(name);

            request.onerror = function (event) {
                ////console.log('事务失败');
                fun(false, event, "事务失败");
            };

            request.onsuccess = function (event) {
                if (request.result) {
                    fun(request.result.what);
                } else {
                    ////console.log('未获得数据记录');
                    fun(false, event, "无数据记录");
                }
            };
        }
        catch (err) {
            fun(false);
        }
    }
    clear(defaultObject, fun) {
        var transaction = this.db_IndexDB.transaction([defaultObject], "readwrite");
        var objectStore = transaction.objectStore(defaultObject);
        var request = objectStore.clear();

        request.onerror = function (event) {
            fun(false, event,);
        };

        request.onsuccess = function (event) {
            fun(true, event);

        };
    }
    delete(defaultObject, name, fun) {
        var transaction = this.db_IndexDB.transaction([defaultObject], "readwrite");
        var objectStore = transaction.objectStore(defaultObject);
        var request = objectStore.delete(name);

        request.onerror = function (event) {
            fun(false, event);
        };

        request.onsuccess = function (event) {
            fun(true, event);
        };
    }
    update(defaultObject, name, data, fun) {
        let that = this;
        this.delete(defaultObject, name, function (value, event) {
            if (value == true) {
                that.add(defaultObject, name, data, function (value, event) {
                    if (value == true) {
                        fun(true);
                    }
                    else {
                        fun(false, event);
                    }
                });
            }
            else {
                fun(false, event);
            }
        });

    }
}

export { cloudIdb };
