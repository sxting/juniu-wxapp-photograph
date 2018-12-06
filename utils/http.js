import xs from '../lib/xstream/index';
import { constant } from 'constant';
import { loading } from 'util';
const REQ_METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

let http = {}

function randomNum(n) {
    var t = '';
    for (var i = 0; i < n; i++) {
        t += Math.floor(Math.random() * 10);
    }
    return t;
}

http.get = (url, data = {}, header = { 'content-type': 'application/json' }) => {
    try {
        let value = wx.getStorageSync(constant.EXPERIENCE_TOKEN)
            ? wx.getStorageSync(constant.EXPERIENCE_TOKEN)
            : wx.getStorageSync(constant.TOKEN);
        let clientId = wx.getStorageSync(constant.CLIENT_ID)
            ? wx.getStorageSync(constant.CLIENT_ID)
            : randomNum.call(this, 30);
        if (value) {
            header = {
                'content-type': 'application/json',
                'token': value,
                'clientType': 'mini',
                'clientId': clientId
            }
        }
        if (!wx.getStorageSync(constant.CLIENT_ID)) {
            wx.setStorageSync(constant.CLIENT_ID, clientId)
        }
    } catch (e) {
        // Do something when catch error
    }
    for (let objName in data) {
        if (data[objName] === undefined || data[objName] === 'undefined') {
            data[objName] = '';
        }
    }
    return http_request(url, REQ_METHOD.GET, data, header)
}

http.post = (url, data = {}, header = { 'content-type': 'application/json' }) => {
    try {
        let value = wx.getStorageSync(constant.EXPERIENCE_TOKEN)
            ? wx.getStorageSync(constant.EXPERIENCE_TOKEN)
            : wx.getStorageSync(constant.TOKEN);
        let clientId = wx.getStorageSync(constant.CLIENT_ID)
            ? wx.getStorageSync(constant.CLIENT_ID)
            : randomNum.call(this, 30);
        if (value) {
            header = {
                'content-type': 'application/json',
                'token': value,
                'clientType': 'mini',
                'clientId': clientId
            }
        }
        if (!wx.getStorageSync(constant.CLIENT_ID)) {
            wx.setStorageSync(constant.CLIENT_ID, clientId)
        }
    } catch (e) {
        // Do something when catch error
    }
    for (let objName in data) {
        if (data[objName] === undefined || data[objName] === 'undefined') {
            data[objName] = '';
        }
    }
    return http_request(url, REQ_METHOD.POST, data, header)
}

http.put = (url, data = {}, header = { 'content-type': 'application/json' }) => {
    try {
        let value = wx.getStorageSync(constant.EXPERIENCE_TOKEN)
            ? wx.getStorageSync(constant.EXPERIENCE_TOKEN)
            : wx.getStorageSync(constant.TOKEN);
        let clientId = wx.getStorageSync(constant.CLIENT_ID)
            ? wx.getStorageSync(constant.CLIENT_ID)
            : randomNum.call(this, 30);
        if (value) {
            header = {
                'content-type': 'application/json',
                'token': value,
                'clientType': 'mini',
                'clientId': clientId
            }
        }
        if (!wx.getStorageSync(constant.CLIENT_ID)) {
            wx.setStorageSync(constant.CLIENT_ID, clientId)
        }
    } catch (e) {
        // Do something when catch error
    }
    return http_request(url, REQ_METHOD.PUT, data, header)
}

http.delete = (url, data = {}, header = { 'content-type': 'application/json' }) => {
    try {
        let value = wx.getStorageSync(constant.EXPERIENCE_TOKEN)
            ? wx.getStorageSync(constant.EXPERIENCE_TOKEN)
            : wx.getStorageSync(constant.TOKEN);
        let clientId = wx.getStorageSync(constant.CLIENT_ID)
            ? wx.getStorageSync(constant.CLIENT_ID)
            : randomNum.call(this, 30);
        if (value) {
            header = {
                'content-type': 'application/json',
                'token': value,
                'clientType': 'mini',
                'clientId': clientId
            }
        }
        if (!wx.getStorageSync(constant.CLIENT_ID)) {
            wx.setStorageSync(constant.CLIENT_ID, clientId)
        }
    } catch (e) {
        // Do something when catch error
    }
    return http_request(url, REQ_METHOD.DELETE, data, header)
}

function http_request(
    url,
    method = REQ_METHOD.GET,
    data = {},
    header = { 'content-type': 'application/json' }) {
    const producer = {
        start: listener => {
            loading();
            wx.request({
                url: url,
                data: data,
                header: header,
                method: method,
                success: res => {
                    if (res.data.errorCode === '10000') {
                        return listener.next(res.data.data);
                    } else {
                        return listener.error(res.data.errorInfo);
                    }
                },
                fail: res => listener.error(res.data.errorInfo),
                complete: () => listener.complete()
            })
        },
        stop: () => { }
    }
    return xs.create(producer)
}

http.uploadFile = (
    url,
    filePath,
    name,
    header = {},
    formData = {}) => {
    const producer = {
        start: listener => {
            wx.uploadFile({
                url: url,
                filePath: filePath,
                name: name,
                header: header,
                formData: formData,
                success: res => listener.next(res),
                fail: res => listener.error(new Error(res.errMsg)),
                complete: () => listener.complete()
            })
        },
        stop: () => { }
    }
    return xs.create(producer)
}

http.downloadFile = (
    url,
    header = {}) => {
    const producer = {
        start: listener => {
            wx.downloadFile({
                url: url,
                header: header,
                success: res => listener.next(res),
                fail: res => listener.error(new Error(res.errMsg)),
                complete: () => listener.complete()
            })
        },
        stop: () => { }
    }
    return xs.create(producer)
}

module.exports = {
    http: http
}
