import { homeService } from 'shared/service';
import { errDialog, loading } from '../../utils/util'
import { constant } from '../../utils/constant';
// import { ticketService } from '../ticket/shared/ticket.service';
import { service } from '../../service';
// import { indexService } from '../index/shared/index.service';
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    latitude: '',
    longitude: '',
    productTagName: '',
    staffTagName: ''
  },

  onLoad: function () {
    let self = this;
    app.userInfoReadyCallback = () => {
      getSysConfig.call(self, `${wx.getStorageSync(constant.MERCHANTID)}_wechat_product`)
      getSysConfig.call(self, `${wx.getStorageSync(constant.MERCHANTID)}_wechat_staff`)
      wx.getLocation({
        success: function (result) {
          self.setData({
            latitude: result.latitude,
            longitude: result.longitude
          })
          closestStore.call(self)
        },
        fail: function (result) {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      })
    }
  }
})

// 最近的门店
function closestStore() {
  let data = {
    latitude: this.data.latitude,
    longitude: this.data.longitude
  }
  let self = this;
  homeService.closestStore(data).subscribe({
    next: res => {
      wx.setStorageSync(constant.STORE_INFO, res.storeId);
      wx.setStorageSync('storeName', res.storeName);
      self.setData({
        storeId: res.storeId,
        storeName: res.storeName
      })
      wx.setNavigationBarTitle({
        title: res.storeName
      })
     
      if (res.pictureVOS && res.pictureVOS.length > 0) {
        res.pictureVOS.forEach((item) => {
          if (item.picUrl) {
            item.picUrl2 = constant.OSS_IMAGE_URL + `${item.picUrl}/resize_690_480/mode_fill`;
            item.picUrl = constant.OSS_IMAGE_URL + `${item.picUrl}/resize_750_520/mode_fill`;
          }
        });
        self.setData({
          productImages: res.pictureVOS
        })
      }
      if (res.productList && res.productList.length && res.productList.length > 0) {
        res.productList.forEach((item, index) => {
          if (item.picUrl && index > 0) {
            item.picUrl = constant.OSS_IMAGE_URL + `${item.picUrl}/resize_334_232/mode_fill`;
          }
        })
        if (res.productList.length == 1 || res.productList.length == 3) {
          if (res.productList[0].picUrl) {
            res.productList[0].picUrl = constant.OSS_IMAGE_URL + `${res.productList[0].picUrl}/resize_690_480/mode_fill`;
          }
        } else {
          res.productList[0].picUrl = constant.OSS_IMAGE_URL + `${res.productList[0].picUrl}/resize_334_232/mode_fill`;
        }
      }

      if (res.staffList && res.staffList.length && res.staffList.length > 0) {
        res.staffList.forEach((item) => {
          if (item.headPortrait) {
            item.headPortrait = constant.OSS_IMAGE_URL + `${item.headPortrait}/resize_220_180/mode_fill`;
          }
        })
      }
      self.setData({
        storeInfo: res,
      });
      getTicketInfo.call(self, res.storeId);
      getStoreInfo.call(self, res.storeId);
      getCollageListInfor.call(self);
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

//获取门店信息
function getStoreInfo(storId) {
  let self = this;
  homeService.storeInfoDetail({ storeId: storId }).subscribe({
    next: res => {
      self.setData({
        storeAddress: res.address,
        tel: res.mobie,
        latitude: res.latitude,
        longitude: res.longitude,
      });
      wx.setStorageSync(constant.address, res.address)
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 标签名称
function getSysConfig(configKey) {
  let self = this;
  homeService.getSysConfig({
    configKey: configKey
  }).subscribe({
    next: res => {
      if (configKey === `${wx.getStorageSync(constant.MERCHANTID)}_wechat_product`) {
        self.setData({
          productTagName: res.configValue ? res.configValue : self.data.productTagName
        })
      } else if (configKey === `${wx.getStorageSync(constant.MERCHANTID)}_wechat_staff`) {
        self.setData({
          staffTagName: res.configValue ? res.configValue : self.data.staffTagName
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 获取卡券信息
function getTicketInfo(storeId) {
  let self = this;
  homeService.ticketList({
    storeId: storeId
  }).subscribe({
    next: res => {
      res.forEach((item) => {
        item.ticketSwitch = 'CLOSE';
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
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 获取拼团信息列表
function getCollageListInfor() {
  let data = {
    storeId: wx.getStorageSync(constant.STORE_INFO),
    belongTo: wx.getStorageSync(constant.MERCHANTID),
    buyerId: wx.getStorageSync(constant.USER_ID),
    pageSize: 2,
    platform: 'WECHAT_SP'
  }
  homeService.getProductList(data).subscribe({
    next: res => {
      if (res) {
        res.elements.forEach(function (item) {
          if (item.activityName && item.activityName.length > 8) {
            item.activityName = item.activityName.substring(0, 8) + '...';
          }
          item.cover = item.cover && item.cover.substring(0, 4) === 'http' ? item.cover : constant.OSS_IMAGE_URL + `${item.cover}/resize_200_150/mode_fill`;
        })
        this.data.collageProductList = res.elements;
        this.setData({
          collageProductList: this.data.collageProductList
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
