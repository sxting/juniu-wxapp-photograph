import { constant } from '../../../utils/constant'
import { errDialog, loading } from '../../../utils/util'
import { shopService } from '../shared/service';
import { service } from '../../../service';
var app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    motto: 'Hello World',
    userInfo: {},
    provinceName: '北京市',
    region: ['北京市', '北京市', '东城区'],
    webServeKey: '3e9b7b7b8d1511312c029f5bf45e1023',
    // 门店选择列表
    storeList: [],
    // 屏幕高度
    windowHeight: 0,
    pageNo: 1,
    pageSize: 10,
    merchantId: '',
    address: '',
    provinceId: '',
    cityId: '',
    areaId: '',
    productId: '',
    latitude: '',
    longitude: '',
    pinTuanId: ''
  },
  onLoad: function (options) {
    let self = this;
    wx.setNavigationBarTitle({
      title: '适用门店',
    })
    if (options.productId) {
      this.setData({
        productId: options.productId
      })
      // 获取当前地理位置
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          self.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          getStoreListInfo.call(self);
          tencentLongAndLatiToAddress.call(self, res.latitude, res.longitude);
        }
      })
    } else if (options.pinTuanId) {
      this.setData({
        pinTuanId: options.pinTuanId
      })
      let storeList = JSON.parse(options.stores)
      storeList.forEach(function (item) {
        item.address = item.storeAddress
      })
      this.setData({
        storeList: storeList
      })
    } else {
      // 获取当前地理位置
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          self.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          getStoreListInfo.call(self);
          tencentLongAndLatiToAddress.call(self, res.latitude, res.longitude);
        }
      })
    }
  },
  onShow: function () {
    let self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowHeight: res.windowHeight
        });
      }
    })

  },

  // 改变地址所在区域
  bindRegionChange: function (e) {
    let self = this;
    self.setData({
      provinceId: '',
      cityId: '',
      areaId: ''
    });
    if (e.detail.value) {
      changeaddrToId.call(self, e.detail.value[0]);
      setTimeout(() => {
        changeaddrToId.call(self, e.detail.value[1]);
      }, 300);
      setTimeout(() => {
        changeaddrToId.call(self, e.detail.value[2], 'areaId');
      }, 650);
      setTimeout(() => {
        getStoreListInfo.call(self);
      }, 900);
    }
    this.setData({
      provinceName: e.detail.value[0],
      region: e.detail.value
    });
  },

  /**点击搜索 搜索具体地址 */
  searchAddr: function (e) {
    this.setData({
      address: e.detail.value
    });
    getStoreListInfo.call(this);
  },

  routerToStoreIndex: function (e) {
    if (this.data.productId || this.data.pinTuanId) {
      return;
    }
    wx.setStorageSync(constant.STORE_INFO, e.currentTarget.dataset.storeid);
    wx.setStorageSync('storeName', e.currentTarget.dataset.storename)

    wx.navigateBack({
      delta: 1
    })
  }
})

/**城市转id */
function changeaddrToId(address, areaId) {
  let self = this;
  shopService.nameToId({ address: address }).subscribe({
    next: res => {
      res.forEach((item) => {
        if (item.level === '1') {
          self.setData({
            provinceId: item.id
          });
        } else if (item.level === '2') {
          if (areaId === 'areaId') {
            self.setData({
              areaId: item.id
            });
          } else {
            self.setData({
              cityId: item.id
            });
          }
        } else if (item.level === '3') {
          self.setData({
            areaId: item.id
          });
        }
      });
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });

}

/**获取门店列表 */
function getStoreListInfo() {
  let self = this;
  let shopQuery = {
    pageNo: self.data.pageNo,
    pageSize: self.data.pageSize,
    // merchantId: '1500022449722218063731',
    merchantId: wx.getStorageSync(constant.MERCHANTID),
    address: self.data.address,
    provinceId: self.data.provinceId,
    cityId: self.data.cityId,
    areaId: self.data.areaId,
    latitude: self.data.latitude,
    longitude: self.data.longitude
  };
  shopService.getStoreList(shopQuery).subscribe({
    next: res => {
      this.setData({
        storeList: res.content
      })
      console.log(res)
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  });
}

/**获取城市id */
function getDistrictInfo(key, loc) {
  shopService.getDistrict().subscribe({
    next: res => {
      console.log(res);
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

/**经纬度转地址 */
function tencentLongAndLatiToAddress(latitude, longitude) {
  let self = this;
  shopService.TencentLongAndLatiToAddress({
    longitude: longitude,
    latitude: latitude
  }).subscribe({
    next: res => {
      self.setData({
        region: [res.province, res.city, res.district],
        provinceName: res.province
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
