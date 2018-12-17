// pages/product/select/select.js
import { productService } from '../shared/service.js'
import { errDialog, changeDate } from '../../../utils/util';
import { constant } from '../../../utils/constant';

Page({
  data: {
    icon20: 'http://i.zeze.com/attachment/forum/201610/30/150453u3oo7n3c702j7f08.jpg',
    juniuImg: '/asset/images/product.png',
    storeId: '',
    productList: [],
    craftsmanId: '',
    craftsmanName: '',
    pageSize: 7,
    pageNo: 1,
    totalPages: 1,
    searchLoading: false,
    from: ''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '精选套餐',
    })
    this.setData({
      storeId: wx.getStorageSync(constant.STORE_INFO),
      from: options.from ? options.from : ''
    })
    if (options.from === 'order') {
      let data = {
        ids: options.productIds,
        storeId: this.data.storeId
      }
      getReserveProductList.call(this, data)
    } else {
      getProductList.call(this)
    }
  },

  //上拉加载更多
  scrolltolower: function () {
    console.log(this.data.pageNo)
    if (this.data.pageNo == this.data.totalPages) {
      return;
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    getProductList.call(this)
  },

  //点击商品 
  onItemClick: function (e) {
    if (this.data.from === 'order') {
      wx.setStorageSync("productId", e.currentTarget.dataset.productId)
      wx.setStorageSync("productName", e.currentTarget.dataset.productName)
      wx.setStorageSync("reservePrice", e.currentTarget.dataset.price)
      wx.switchTab({
        url: `/pages/order/order`,
      })
    } else if (this.data.from === 'making') {
      wx.redirectTo({
        url: `/pages/comment/making/making?productId=${e.currentTarget.dataset.productId}&storeId=${this.data.storeId}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/product/detail/detail?productId=${e.currentTarget.dataset.productId}&storeId=${this.data.storeId}`,
      })
    }
  }

})

// 获取预约商品列表
function getReserveProductList(data) {
  productService.getReserveProduct(data).subscribe({
    next: res => {
      res.forEach((item) => {
        if (item.picUrl) {
          item.picUrl = constant.OSS_IMAGE_URL + `${item.picUrl}/resize_165_120/mode_fill`;
        }
      });
      this.setData({
        productList: res
      })
    },
    error: err => errDialog(err),
    complete:() => wx.hideToast()
  })
}

// 获取商品列表
function getProductList() {
  let data = {
    storeId: this.data.storeId,
    pageNo: this.data.pageNo,
    pageSize: this.data.pageSize
  }
  if (this.data.categoryId) {
    data.categoryId = this.data.categoryId;
  }
  productService.getProductList(data).subscribe({
    next: res => {
      res.content.forEach((item) => {
        if (item.picUrl) {
          item.picUrl = constant.OSS_IMAGE_URL + `${item.picUrl}/resize_165_120/mode_fill`;
        }
      });
      this.setData({
        productList: this.data.productList.concat(res.content),
        totalPages: res.totalPages,
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}