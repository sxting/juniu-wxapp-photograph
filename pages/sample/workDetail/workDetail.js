import { sampleService } from '../shared/service.js';
import { constant } from '../../../utils/constant';

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
    imgsrc:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({
      title: '视频详情',
    })
    this.setData({
      src: options.src || '',
      storeId: wx.getStorageSync(constant.STORE_INFO) || '1531800050458194516965'
    })
    if (options.imgUrl){
      let list = options.imgUrl.split(',');
      this.setData({
        imgsrc: workDataFun.call(this, list)
      })
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

  },

  


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/shop/video/detail/detail?type=share&productionId=' + this.data.productionId + '&storeId=' + this.data.storeId,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    }
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