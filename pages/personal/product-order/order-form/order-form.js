import { personalService } from '../../shared/service.js'
import { errDialog } from '../../../../utils/util';
import { constant } from '../../../../utils/constant';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['全部', '待付款', '待消费', '已完成'],
    tabIndex: 0,
    status: '', // CLOSE 已取消，  
    orderList: [],
    jnImg: '/asset/images/product.png'
  },

  onShow: function () {
    wx.setNavigationBarTitle({
      title: '我的订单',
    })
    getOrderList.call(this)
  },

  onTabClick(e) {
    let index = e.currentTarget.dataset.index;
    let status = '';
    if(index == 1) {
      status = 'INIT'
    } else if (index == 2) {
      status = 'PAID'
    } else if (index == 3) {
      status = 'FINISH'
    } else {
      status = ''
    }
    this.setData({
      tabIndex: index,
      status: status
    })
    getOrderList.call(this)
  },

  onItemClick(e) {
    wx.navigateTo({
      url: '/pages/personal/product-order/order-form-detail/order-form-detail?orderId=' + e.currentTarget.dataset.orderid,
    })
  }
  
})


// 订单列表 
function getOrderList() {
  let data = {
    status: this.data.status
  }
  personalService.getOrderList(data).subscribe({
    next: res => {
      res.forEach(function(item) {
        if (item.orderItem && item.orderItem[0] && item.orderItem[0].picId) {
          item.orderItem[0].picId = constant.OSS_IMAGE_URL + `${item.orderItem[0].picId}/resize_80_60/mode_fill`;
        }
        let date = new Date(item.payDate)
        item.payDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      })
      
      this.setData({
        orderList: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}