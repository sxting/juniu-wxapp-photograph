import {constant} from '../../utils/constant';
import {errCheck} from '../../utils/util';
import xs from '../../lib/xstream/index';
let jnService = {}
/**
 * 自定义扫一扫
 * @param fn
 */
jnService.scanCode = (fn) => {
  wx.scanCode({
    success: (res) => {
      fn(res);
    }
  });
}
/**
 * 自定义确认框
 * @param title 标题
 * @param content 内容
 * @param cancelText 取消键文案
 * @param confirmText 确认键文案
 * @param yes 成功回掉
 */
jnService.confirm = (title, content, showCancel, cancelText, confirmText, yes) => {
  wx.showModal({
    title: title,
    content: content,
    showCancel: true,
    cancelText: cancelText,
    confirmText: confirmText,
    success: function (res) {
      if (res.confirm) {
        yes();
      }
    }
  })
}
//本地选图片
jnService.uploadImage = () => {
  const producer = {
    start: listener => {
      wx.chooseImage({
        success: function (res) {
          let tempFilePaths = res.tempFilePaths;
          return listener.next(tempFilePaths);
        },
        fail: res => listener.error(new Error(res.errMsg)),
        complete: () => listener.complete()
      })
    },
    stop: () => {}
  }
  return xs.create(producer)
}

//上传文件
jnService.uploadFile = (
  storeId,
  url,
  filePath,
  name,
  header={},
  formData={}) => {
  let value = wx.getStorageSync(constant.EXPERIENCE_TOKEN)
    ? wx.getStorageSync(constant.EXPERIENCE_TOKEN)
    : wx.getStorageSync(constant.TOKEN);
  if (value) {
    header = {
      'content-type': 'application/json',
      'token': value
    }
  }
  const producer = {
    start: listener => {
      wx.uploadFile({
        url: constant.apiUrl + '/merchant/uploadImage.json',
        filePath: filePath,
        name: 'file',
        formData: {
          'bizType': 'store_info',
          'storeId': storeId,
          'cutRules': JSON.stringify([{width: 345, height: 164}, {width: 160, height: 160}])
        },
        header: header,
        count: 1, // 默认9
        // 可以指定是原图还是压缩图，默认二者都有
        sizeType: ['original', 'compressed'],
        // 可以指定来源是相册还是相机，默认二者都有
        sourceType: ['album', 'camera'],
        success: res => listener.next(res),
        fail: res => listener.error(new Error(res.errMsg)),
        complete: () => listener.complete()
      })
    },
    stop: () => {}
  }
  return xs.create(producer)
}
module.exports = {
  jnService: jnService
}

