import { personalService } from '../../shared/service.js';
import { errDialog, loading } from '../../../../utils/util';
import { constant } from '../../../../utils/constant'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{ typeText: '全部',status: ''},{ typeText: '待付款',status: 'PRE_PAYMENT'},{ typeText: '待成团',status: 'JOINING_GROUP'},{ typeText: '待消费',status: 'FINISHED_GROUP'},{ typeText: '已完成',status: 'FINISHED'}],
    tabIndex: 0,
    status: '', // CLOSE 已取消， 
    productImg: '/asset/images/product.png',
    collageListInfor: [],
    groupId: '',
    storeId: '',
    prePaymentArrData: [],//待付款
    joiningGroupArrData: [],//待成团
    finishedGroupArrData: [],//待消费
    finishedArrData: []//已完成
  },

  onLoad: function () {
    let self = this;
    this.setData({
      storeId: wx.getStorageSync(constant.STORE_INFO)
    })
    wx.setNavigationBarTitle({
      title: '拼团订单',
    })
  },

  onShow: function() {
    // 获取拼团订单列表
    getCollageOrderList.call(this, '');
  },

  // tab切换 
  onTabClick(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index,
      status: e.currentTarget.dataset.status
    })
    getCollageOrderList.call(this, this.data.status);
  },

  /** 点击团单到订单详情页 */ 
  checkOrderDetailInfor: function(e){
    console.log(e.currentTarget.dataset.orderno);
    let orderno = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: '/pages/personal/collage-order/detail/detail?orderNo=' + orderno 
    })
  },

  /*** 立即支付 */ 
  payImmediate: function (e) {
    let orderno = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: '/pages/personal/collage-order/detail/detail?orderNo=' + orderno
    })
  },

  /** 取消 */ 
  cancelClick: function (e) {
    console.log(e.currentTarget.dataset.orderno);
    let orderId = e.currentTarget.dataset.orderno;
    let data = {
      orderNo: orderId,
      platform: 'WECHAT_SP'
    }
    personalService.cancelFunction(data).subscribe({
      next: res => {
        if (res) {
          console.log(res);
          wx.navigateTo({
            url: '/pages/personal/collage-order/detail/detail?orderNo=' + orderId
          })
        }
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let self = this;
    let orderno = res.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: '/pages/personal/collage-order/detail/detail?orderNo=' + orderno
    })
  },
  
  //  立即评价
  evaluationImmediate: function(e){
    console.log(e.currentTarget.dataset.activityid);
    wx.navigateTo({
      url: '/pages/comment/making/making?activityId=' + e.currentTarget.dataset.activityid + '&orderId=' + e.currentTarget.dataset.orderno
    })
  }
})

/**  获取拼团列表 ***/ 
function getCollageOrderList(type){
  let data = {
    platform: 'WECHAT_SP'
  }
  personalService.getCollageListInfor(data).subscribe({
    next: res => {
      if (res) {
        console.log(res);
        let arrCollagesList = res.elements ? res.elements : [];
        let prePaymentArr = []; 
        let joiningGroupArr = []; 
        let finishedGroupArr = []; 
        let finishedArr = [];
        arrCollagesList.forEach(function(item){
          item.activityName = item.activityName&&item.activityName.length > 8 ? item.activityName.substring(0, 8) + '...' : item.activityName;
          item.picUrl = item.imageUrl ? constant.OSS_IMAGE_URL + `${item.imageUrl}/resize_100_75/mode_fill` : '';
          if (item.orderStatus === 'PAID'){//已经支付
            if (item.groupStatus === 'JOINING' && item.tabStatus === 'JOINING_GROUP' ){
              item.orderStatusText = '待成团';
            } else if (item.settleStatus === 'REFUND'){
              item.orderStatusText = '已退款';
            } else if (item.settleStatus === 'VALID') {
              item.orderStatusText = '待消费';
            } else if (item.settleStatus === 'SETTLE') {
              item.orderStatusText = '已消费';
            } else if (item.settleStatus === 'EXPIRE_REFUND') {
              item.orderStatusText = '已过期';
            }
          }else{
            if (item.orderStatus === 'PRE_PAYMENT'){
              item.orderStatusText = '待付款';
            } else if (item.orderStatus === 'PAYMENT_TIMEOUT' || item.orderStatus === 'CANCEL'){
              item.orderStatusText = '已关闭';
            }
          }
          /** 分类 */ 
          if (item.tabStatus === 'PRE_PAYMENT') {//待付款
            prePaymentArr.push(item);
          } else if (item.tabStatus === 'JOINING_GROUP') {//待成团
            joiningGroupArr.push(item);
          } else if (item.tabStatus === 'FINISHED_GROUP') {//待消费
            finishedGroupArr.push(item);
          } else if (item.tabStatus === 'FINISHED') {//已完成
            finishedArr.push(item);
          }
        })
        let arrData = [];
        if (type === 'PRE_PAYMENT'){
          arrData = prePaymentArr;
        } else if (type === 'JOINING_GROUP'){
          arrData = joiningGroupArr;
        } else if (type === 'FINISHED_GROUP') {
          arrData = finishedGroupArr;
        } else if (type === 'FINISHED') {
          arrData = finishedArr;
        } else {
          arrData = arrCollagesList;
        }
        console.log(arrData);
        this.setData({
          collageListInfor: arrData
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
