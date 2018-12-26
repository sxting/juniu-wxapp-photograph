import { sampleService } from '../shared/service.js';
import { constant } from '../../../utils/constant';
import { service } from '../../../service';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: wx.getStorageSync(constant.STORE_INFO),
    getUserInfo: true,
    bigImage: '/asset/images/pintuan_head1.jpg',
    worksList: [],
    imageWidth: 375,
    showVideo: false,
    src: '',
    productionId: '',
    title: ''  ,
    imgsrc:[],
    shared: false
  },

  onShow: function () {
    let self = this;
    if (this.data.shared) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            let callbackFun = function () {
              self.setData({
                src: options.src || '',
                storeId: wx.getStorageSync(constant.STORE_INFO)
              })
              if (options.imgUrl) {
                let list = options.imgUrl.split(',');
                self.setData({
                  imgsrc: workDataFun.call(self, list)
                })
                wx.setNavigationBarTitle({
                  title: '图片详情',
                })
              }
            };
            wx.login({
              success: function (result) {
                wx.getUserInfo({
                  success: res => {
                    service.logInFun(result.code, res.rawData, callbackFun);
                  },
                  fail: () => { }
                })
              }
            });
          } else {
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '视频详情',
    })
    
    let self = this;
    if (options.type == 'share') {
      this.setData({
        shared: true,
      })
      wx.getSetting({
        success: res => { 
          if (res.authSetting['scope.userInfo']) {
            let callbackFun = function () {
              self.setData({
                src: options.src || '',
                storeId: wx.getStorageSync(constant.STORE_INFO)
              })
              if (options.imgUrl) {
                let list = options.imgUrl.split(',');
                self.setData({
                  imgsrc: workDataFun.call(self, list)
                })
                wx.setNavigationBarTitle({
                  title: '图片详情',
                })
              }
            };
            wx.login({
              success: function (result) {
                wx.getUserInfo({
                  success: res => {
                    service.logInFun(result.code, res.rawData, callbackFun);
                  },
                  fail: () => { }
                })
              }
            });
          } else {
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {
      self.setData({
        src: options.src || '',
        storeId: wx.getStorageSync(constant.STORE_INFO)
      })
      if (options.imgUrl){
        wx.setNavigationBarTitle({
          title: '图片详情',
        })
        let list = options.imgUrl.split(',');
        self.setData({
          imgsrc: workDataFun.call(self, list)
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onShareAppMessage: function (res) {
    return {
      title: wx.getStorageSync('storeName'),
      path: 'pages/sample/workDetail/workDetail?type=share&imgUrl='+this.data.imgsrc,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
function workDataFun(data) {
  let resData = [];
  data.forEach(function (item) {
    resData.push({
      picId:  item
    })
  })
  resData.forEach(function (item) {
    let index = item.picId.lastIndexOf('_');
    let scale = item.picId.slice(index + 1, item.picId.length);
    item.height = Math.floor(375 / scale);
    item.url = constant.OSS_IMAGE_URL + `${item.picId}/resize_${375}_${item.height}/mode_fill`
  })
  return resData;
}