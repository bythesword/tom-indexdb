
import { md5 } from "../libs/md5/md5";
import { cloudIdb } from "./cloudidb";
class SaveDB {

    constructor(URL, DB = "CM") {
        this.input = input;
        this.parent = input.parent;
        this.MD5 = md5;
        this.dbName = input.dbName;
        this.defaultObject = "CM";
        if (typeof input.defaultObject != "undefined") {
            this.defaultObject = input.defaultObject;
        }
        this.succeed = false;
        this.init(input.dbName);
    }
    init(dbName) {
        let that = this;
        this.md5dbName = this.MD5(dbName);
        this.DB = new cloudIdb(this.defaultObject, this.md5dbName, function (value) {
            that.succeed = value;
            if (typeof that.input.fun == "function")
                that.input.fun();
        });

    }
    add(name, data) {
        let that = this;
        if (this.DB) {
            this.DB.add(this.defaultObject, name, data, function (value, event) {
                that.succeed = value;
                if (value === false)
                    that.parent.log(
                        {
                            log: "warning",
                            succeed: value,
                            subject: "indexDB add error,db name is :" + that.dbName,
                            sender: "saveDB",
                            data: event,
                        }
                    );
            });
        }
    }

    get(name, fun) {
        let that = this;
        try {
            if (this.DB) {
                this.DB.read(this.defaultObject, name, function (value, event, log) {
                    that.succeed = value;
                    if (value === false) {
                        fun(value);
                        that.parent.log(
                            {
                                log: "warning",
                                succeed: value,
                                subject: "indexDB read error,db name is :" + that.dbName + " log info :" + log,
                                sender: "saveDB",
                                data: event,
                            }
                        );
                    }
                    else {
                        // console.log(value);
                        fun(value);
                    }
                });
            }
        }
        catch (err) {
            fun(false);
        }
    }

    clear() {
        let that = this;
        this.DB.clear(this.defaultObject, function (value, event) {
            that.succeed = value;
            if (value === false)
                that.parent.log(
                    {
                        log: "warning",
                        succeed: value,
                        subject: "indexDB clear error,db name is :" + that.dbName,
                        sender: "saveDB",
                        data: event,
                    }
                );
        });
    }
    delete(name) {
        let that = this;
        this.DB.delete(this.defaultObject, name, function (value, event) {
            that.succeed = value;
            if (value === false)
                that.parent.log(
                    {
                        log: "warning",
                        succeed: value,
                        subject: "indexDB clear error,db name is :" + that.dbName,
                        sender: "saveDB",
                        data: event,
                    }
                );
        });
    }
    update(name, data) {
        let that = this;
        this.DB.update(this.defaultObject, name, data, function (value, event) {
            that.succeed = value;
            if (value === false)
                that.parent.log(
                    {
                        log: "warning",
                        succeed: value,
                        subject: "indexDB update error,db name is :" + that.dbName,
                        sender: "saveDB",
                        data: event,
                    }
                );
        });
    }


}
export { SaveDB };