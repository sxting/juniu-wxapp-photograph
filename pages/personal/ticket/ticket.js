var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
import { personalService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';
import { constant } from '../../../utils/constant';

var NP = require('../../../utils/number-precision.js')
// 类型 UNUSED(可使用)，USED(已使用)，OVERDUE(已过期)
Page({
  data: {
    tabs: ["可使用", "已使用", "已过期"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    storeId: '',
    ticketList: [],
    productId: '',
    ticketId: '',
    selectedTicketId: '',
    price: 0
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的优惠券',
    })
    if (options.productId) {
      this.setData({
        productId: options.productId,
        selectedTicketId: options.ticketId ? options.ticketId : '',
        price: options.price
      })
    }
    var that = this;
    this.setData({
      storeId: wx.getStorageSync(constant.STORE_INFO)
    });
    getMyTicket.call(this, this.data.storeId, 'UNUSED');
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    console.log(e.currentTarget.id)
    switch (e.currentTarget.id) {
      case "0":
        getMyTicket.call(this, this.data.storeId, 'UNUSED');
        break;
      case "1":
        getMyTicket.call(this, this.data.storeId, 'USED');
        break;
      case "2":
        getMyTicket.call(this, this.data.storeId, 'OVERDUE');
        break;
    }
  },

  //选择优惠券 
  onTicketItemClick(e) {
    let item = e.currentTarget.dataset.item ? e.currentTarget.dataset.item : { useLimitMoney : -1 };
    if (this.data.productId && e.currentTarget.dataset.canuse && this.data.activeIndex === 0 && item.useLimitMoney <= this.data.price) {
      wx.setStorageSync(constant.couponId, e.currentTarget.dataset.couponid)
      if (item.couponDefType === 'MONEY') {
        wx.setStorageSync(constant.couponPrice, item.couponDefAmount / 100)
      } else if (item.couponDefType === 'DISCOUNT') {
        let price = NP.times(NP.minus(1, NP.divide(item.couponDefDiscount, 10)), this.data.price) 
        wx.setStorageSync(constant.couponPrice, parseInt(price)/100)
      }
      wx.navigateBack({
        delta: 1
      })
    }
  },

  // 优惠券展开
  onTicketBottomClick(e) {
    let marketingId = e.currentTarget.dataset.marketingid;
    this.data.ticketList.forEach((item) => {
      if (marketingId === item.marketingId) {
        if (item.ticketSwitch === 'OPEN') {
          item.ticketSwitch = 'CLOSE';
        } else {
          item.ticketSwitch = 'OPEN';
        }
      } else {
        item.ticketSwitch = 'CLOSE';
      }
    });
    this.setData({
      ticketList: this.data.ticketList
    })
  },
});
// 获取我的优惠券
function getMyTicket(storeId, couponStatus) {
  let self = this;
  personalService.myTicket({
    storeId: storeId,
    couponStatus: couponStatus
  }).subscribe({
    next: res => {
      res.forEach((item) => {
        item.ticketSwitch = 'CLOSE';
        item.consumeLimitProductIdsArr = item.consumeLimitProductIds.split(',');
        item.productNoUse = (item.consumeLimitProductIdsArr.indexOf(self.data.productId) < 0 && item.consumeLimitProductIds != '');
        if (item.disabledWeekDate) {
          let disabledWeekDateArr = item.disabledWeekDate.split(',');
          item.selectedWeek1 = weekText.call(self, disabledWeekDateArr[0]);
          item.selectedWeek2 = weekText.call(self, disabledWeekDateArr[disabledWeekDateArr.length - 1]);
          if (item.disabledTimeStart && item.disabledTimeEnd) {
            item.disabledTimeStart = item.disabledTimeStart.replace(/-/g, '/');
            item.disabledTimeEnd = item.disabledTimeEnd.replace(/-/g, '/');
            item.unUseStartTime = (new Date(item.disabledTimeStart).getHours().toString().length < 2 ? ('0' + new Date(item.disabledTimeStart).getHours()) : new Date(item.disabledTimeStart).getHours()) + ':' +
              (new Date(item.disabledTimeStart).getMinutes().toString().length < 2 ? ('0' + new Date(item.disabledTimeStart).getMinutes()) : new Date(item.disabledTimeStart).getMinutes());
            item.unUseEndTime = (new Date(item.disabledTimeEnd).getHours().toString().length < 2 ? ('0' + new Date(item.disabledTimeEnd).getHours()) : new Date(item.disabledTimeEnd).getHours()) + ':' +
              (new Date(item.disabledTimeEnd).getMinutes().toString().length < 2 ? ('0' + new Date(item.disabledTimeEnd).getMinutes()) : new Date(item.disabledTimeEnd).getMinutes());
          }
        }
      });
      self.setData({
        ticketList: res
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}

function weekText(str) {
  let name = '';
  switch (str) {
    case '1':
      name = '周一';
      break;
    case '2':
      name = '周二';
      break;
    case '3':
      name = '周三';
      break;
    case '4':
      name = '周四';
      break;
    case '5':
      name = '周五';
      break;
    case '6':
      name = '周六';
      break;
    case '7':
      name = '周日';
      break;
  }
  return name;
}