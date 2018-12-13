import { ticketService } from '../../../pages/ticket/shared/service.js';
import { constant } from '../../../utils/constant';

export default Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    ticketItem: {
      type: Object,
      value: {},
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    // 这里是一个自定义方法
    reciveTicket: function (e) {
      let self = this;
      let marketingId = e.currentTarget.dataset.marketingid;
      let storeId = wx.getStorageSync(constant.STORE_INFO);
      ticketService.receiveTicket({ marketingId: marketingId, storeId: storeId }).subscribe({
        next: res => {
          wx.showModal({
            title: '领取成功',
            content: '请到个中心我的优惠券中查看',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 
                self.triggerEvent('customevent', {}, { bubbles: true, composed: true })
              }
            }
          })
        },
        error: err => errDialog(err),
        complete: () => wx.hideToast()
      })
    },
    reciveTicketAndBind: function (e) {
      wx.navigateTo({
        url: '/pages/personal/member-card/band/band?marketingid=' + e.currentTarget.dataset.marketingid,
      })
    }
  }
})