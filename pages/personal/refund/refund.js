import { personalService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';
import { constant } from '../../../utils/constant';

Page({
  data: {
    orderId: '',
    orderDetail: '',
    jnImg: '/asset/images/product.png',
    success: false
  },

  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    wx.setNavigationBarTitle({
      title: '申请退款',
    })
    getOrderDetail.call(this);
  },

  onRefundClick() {
    refund.call(this)
  },

  successYBtnClick() {
    this.setData({
      success: false
    })
    wx.navigateBack({
      delta: 2
    })
  }
  
})

// 申请退款 
function refund() {
  let data = {
    orderId: this.data.orderId
  }
  personalService.refund(data).subscribe({
    next: res => {
      this.setData({
        success: true
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 订单详情  
function getOrderDetail() {
  let data = {
    orderId: this.data.orderId
  }
  personalService.getOrderDetail(data).subscribe({
    next: res => {
      if (res.orderItem[0] && res.orderItem[0].picId) {
        res.orderItem[0].picId = constant.OSS_IMAGE_URL + `${res.orderItem[0].picId}/resize_140_100/mode_fill`;
      }
      this.setData({
        orderDetail: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}