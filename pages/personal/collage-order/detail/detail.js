import { personalService } from '../../shared/service.js';
import { errDialog, loading } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';
var wxbarcode = require('../../../../utils/index.js');

Page({
  /*** 页面的初始数据 */
  data: {
    orderNo: '',
    pictureUrl: '/asset/images/product.png',
    activityCover: '',
    restHour: '',
    restMinute: '',
    restSecond: '',
    phone: '',
    groupId: '',
    activityId: '',
    collageStatus: '',
    orderDetailArr: {},//订单信息
    activityName: '',
    collageNumber: 0,
    remainingNumber: 0,
    hadCollageNumber: 0,
    groupNo: '',
    arrCollageImageShow: [ ],
    remainingCollages: [],
    settleCode: '',
    voucherOrderTime: '',
    voucherStatus: '',
    isOnLoad: false,
    applyStores: [],
    timerAll: '',
    showBtn: false,
    showStore: true,
  },

  /*** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    let self = this;
    wx.setNavigationBarTitle({
      title: '订单详情',
    })
    this.setData({
      orderNo: options.orderNo ? options.orderNo : '',
      showBtn: options.show && options.show === 'true'? true : false
    })
    
    /** 调取订单详情接口 */
    setTimeout(function(){
      getCollageOrderDetail.call(self);
    },1000)
  },

  onShow: function() {
    let self = this;
    getCollageOrderDetail.call(self);
  },

  onUnload: function(){
    clearInterval(this.data.timerAll);
  },

  onHide: function () {
    clearInterval(this.data.timerAll);
  },

  /*** 邀请好友参团 */
  onShareAppMessage: function (res) {
    let self = this;
    return {
      title: wx.getStorageSync('邀请好友'),
      path: '/pages/collage/product-detail/product-detail?groupId=' + this.data.groupId + '&activityId=' + this.data.activityId + '&storeId=' + wx.getStorageSync(constant.STORE_INFO) + '&type=share',
      success: function (res) {
        // 转发成功
        console.log(res + '转发成功');
        self.setData({
          isOnLoad: true
        })
      },
      fail: function (res) {
        // 转发失败
        console.log(res);
      }
    }
  },

  /**  拨打电话  **/
  onTelClick() {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.phone
    })
  },

  /**  点击复制按钮  **/
  copyTextBtn(e){
    let copyData = e.currentTarget.dataset.copydata;
    wx.setClipboardData({
      data: copyData,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  /**  适用门店  ***/ 
  storeListClick(){
    this.setData({
      showStore: false,
    })
  },
  routerToStoreIndex(){
    this.setData({
      showStore: true,
    })
  },
  /** 立即支付 */ 
  orderPaymentClick(){
    orderPayment.call(this);
  },

  /** 返回首页 */ 
  comeBackHome(){
    wx.reLaunch({
      url: '/pages/home/home'
    })
  }
})

/** 获取订单详情页面 */
function getCollageOrderDetail() {
  let self = this;
  let data = {
    orderNo: this.data.orderNo,
    platform: 'WECHAT_SP'
  }
  personalService.getCollageOrderDetail(data).subscribe({
    next: res => {
      if (res) {
        console.log(res);
        /** 剩余拼团人数 ****/
        let remainingNumber = res.currentGroup ? Number(res.peopleCount) - Number(res.currentGroup.picUrls.length) : 0;

        /*** 图片逻辑 ***/
        let collagesImage = res.currentGroup ? res.currentGroup.picUrls : [];
        if (res.peopleCount > 4) {
          this.data.arrCollageImageShow = collagesImage.slice(0, 3);
        } else {
          this.data.arrCollageImageShow = collagesImage;
        }
        /*** 未拼团图像 ****/
        let remainingCollagesArr = [];
        if (remainingNumber > 0 && res.currentGroup) {
          if (Number(res.peopleCount) > 4 && Number(res.currentGroup.picUrls.length) === 1) {
            for (let i = 0; i < 2; i++) {
              let list = '';
              remainingCollagesArr.push(list);
            }
          } else if (Number(res.peopleCount) > 4 && Number(res.currentGroup.picUrls.length) === 2) {
            for (let i = 0; i < 1; i++) {
              let list = '';
              remainingCollagesArr.push(list);
            }
          } else if (Number(res.peopleCount) > 4 && Number(res.currentGroup.picUrls.length) >= 3) {
            remainingCollagesArr = [];
          } else {
            for (let i = 0; i < remainingNumber; i++) {
              let list = '';
              remainingCollagesArr.push(list);
            }
          }
        }
        let activityCoverUrl = res.activityCover ? constant.OSS_IMAGE_URL + `${res.activityCover}/resize_110_83/mode_fill` :  '';
        /*****  拼团成功  ***/
        let settleCode = res.voucher ? res.voucher.code : '';
        let voucherOrderTime = res.voucher ? res.voucher.orderTime : '';
        let voucherStatus = '';//拼团成功以后的状态
        if (res.voucher) {
          if (res.voucher.settleStatus === 'VALID') {
            voucherStatus = '未使用';
          } else if (res.voucher.settleStatus === 'SETTLE') {
            voucherStatus = '已核销';
          } else if (res.voucher.settleStatus === 'EXPIRE_REFUND') {
            voucherStatus = '已过期';
          } else {
            voucherStatus = '已退款';//REFUND
          }
          /** 券码 **/ 
          wxbarcode.barcode('barcode', res.voucher.code, 520, 186);
        }
        this.setData({
          activityName: res.activityName.length > 8 ? res.activityName.substring(0, 8) + '...' : res.activityName,
          activityCover: activityCoverUrl,
          collageStatus: res.groupStatus,
          orderDetailArr: res,
          activityId: res.activityId,
          groupId: res.groupNo,
          collageNumber: res.peopleCount,
          phone: res.applyStores&&res.applyStores.length>0?res.applyStores[0].storePhones[0]:'',
          hadCollageNumber: res.currentGroup ? res.currentGroup.picUrls.length : 0,
          remainingNumber: remainingNumber,
          arrCollageImageShow: this.data.arrCollageImageShow,
          remainingCollages: remainingCollagesArr,
          settleCode: settleCode,
          voucherOrderTime: voucherOrderTime,
          voucherStatus: voucherStatus,
          applyStores: res.applyStores,
        })
        /** 拼团数据 **/
        let countDownTime = '';
        let expireTime = res.currentGroup && res.currentGroup != null ? res.currentGroup.expireTime.replace(/-/g, '/') : '';
        let time = new Date(expireTime).getTime() - new Date().getTime();
        if (time <= 0) {
          countDownTime = '00:00:00'
        } else {
          let hours = parseInt(time / 1000 / 60 / 60 + '');
          let minutes = parseInt(time / 1000 / 60 - hours * 60 + '');
          let seconds = parseInt(time / 1000 - minutes * 60 - hours * 3600 + '');
          countDownTime = (hours.toString().length < 2 ? '0' + hours : hours) + ':' +
            (minutes.toString().length < 2 ? '0' + minutes : minutes) + ':' +
            (seconds.toString().length < 2 ? '0' + seconds : seconds);
        }
        console.log(countDownTime);
        this.setData({
          restHour: countDownTime.substring(0, 2),
          restMinute: countDownTime.substring(3, 5),
          restSecond: countDownTime.substring(6)
        })
        /* 倒计时 */
        let downTime = '2000/01/01';
        let timer = setInterval(function () {
          if (new Date(downTime + ' ' + countDownTime).getHours().toString() === '0' && new Date(downTime + ' ' + countDownTime).getMinutes().toString() === '0' && new Date(downTime + ' ' + countDownTime).getSeconds().toString() === '0') {
            countDownTime = '00:00:00';
            clearInterval(timer);
          } else {
            let times = new Date(new Date(downTime + ' ' + countDownTime).getTime() - 1000);
            countDownTime =
              (times.getHours().toString().length < 2 ? '0' + times.getHours() : times.getHours()) + ':' +
              (times.getMinutes().toString().length < 2 ? '0' + times.getMinutes() : times.getMinutes()) + ':' +
              (times.getSeconds().toString().length < 2 ? '0' + times.getSeconds() : times.getSeconds());
          }
          self.setData({
            restHour: countDownTime.substring(0, 2),
            restMinute: countDownTime.substring(3, 5),
            restSecond: countDownTime.substring(6)
          })
        }, 1000)

        console.log(this.data.isOnLoad);
        if (res.groupStatus != 'FINISH' && this.data.isOnLoad) {
          console.log('hahaha');
          this.setData({
            timerAll: setInterval(function () {
              getCollageOrderDetail.call(self);
            }, 20000)
          })
        }else{
          clearInterval(self.data.timerAll);
        }
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

/*** 立即支付 ***/
function orderPayment() {
  let self = this;
  let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
  let appId = extConfig.theAppid ? extConfig.theAppid : 'wx0c66057a9b376be1';
  let data = {
    activityId: this.data.activityId,
    appid: appId,
    storeId: wx.getStorageSync(constant.STORE_INFO),
    buyerPhone: this.data.phone,
    platform: 'WECHAT_SP'
  }
  personalService.paymentSubmit(data).subscribe({
    next: res => {
      console.log(res);
      if (res) {
        wx.requestPayment({
          timeStamp: res.payInfo.timeStamp,
          nonceStr: res.payInfo.nonceStr,
          package: res.payInfo.package,
          signType: res.payInfo.signType,
          paySign: res.payInfo.paySign,
          success: function (result) {
            setTimeout(function () {
              getCollageOrderDetail.call(self);
            }, 1000)
          },
          fail: function (result) {
            setTimeout(function () {
              getCollageOrderDetail.call(self);
            }, 1000)
          },
          complete: function (result) {
            
          }
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}