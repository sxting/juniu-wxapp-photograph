// pages/sample/index/index.js
import { errDialog } from '../../../utils/util';
import { sampleService } from '../shared/service.js';
import { constant } from '../../../utils/constant';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: wx.getStorageSync(constant.STORE_INFO) ||'1531800050458194516965',
    worksList: [],
    imageWidth: 414,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    getWorkList.call(this);
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
  onShareAppMessage: function () {

  },
  goWorkDetail(e) {
    let type = e.currentTarget.dataset.type
    console.log(e);
    if (type === 'VIDEO') {
      getData.call(this, e.currentTarget.dataset.id);
      
    } else {
      let url = ''
      e.currentTarget.dataset.list.forEach(function(i){
        url += (i.sourceId+',')
      })
      wx.navigateTo({
        url: '/pages/sample/workDetail/workDetail?imgUrl=' + url,
      })
    }
  }
})

function getWorkList() {
  let data = {
    id: this.data.storeId,
    type: 'STORE'
  };
  let self = this;
  sampleService.getStoreWorkList(data).subscribe({
    next: res => {
      this.setData({
        worksList: workDataFun(res, self.data.imageWidth)
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
function getData(productionId) {
  let data = {
    productionId: productionId
  }
  let self = this;
  sampleService.getStaffProductionDetail(data).subscribe({
    next: res => {
      let imageList = []
      res.production.merchantMediaDTOS.forEach(function (item, i) {
        imageList.push({
          sourceId: item.sourceId
        })
      })
      let videoId = imageList[0].sourceId.split(',')[1];
      showVideo.call(this, videoId);

    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

function showVideo(videoId) {
  let data = {
    videoId: videoId
  }
  sampleService.getVideoUrlById(data).subscribe({
    next: res => {
      this.setData({
        showVideo: true,
        src: res
      })
      wx.navigateTo({
        url: '/pages/sample/workDetail/workDetail?src=' + res,
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
function workDataFun(data, imgW) {
  let resData = [];
  data.forEach(function (item) {
    resData.push({
      productionId: item.productionId,
      name: item.title,
      sourceType: item.sourceType,
      picId: item.sourceType === 'VIDEO' ? item.merchantMediaDTOS[0].sourceId.split(',')[0] : item.merchantMediaDTOS[0].sourceId,
      merchantMediaDTOS: item.merchantMediaDTOS
    })
  })

  resData.forEach(function (item) {
    let index = item.picId.lastIndexOf('_');
    // let picId = item.picId.slice(0, index);
    let scale = item.picId.slice(index + 1, item.picId.length);
    item.height = item.sourceType === 'VIDEO' ? Math.floor(imgW / scale) : Math.floor(imgW / scale)*2;
    console.log(item.height)
    item.url = constant.OSS_IMAGE_URL + `${item.picId}/resize_${imgW}_${item.height}/mode_fill`
  })

  return resData;
}