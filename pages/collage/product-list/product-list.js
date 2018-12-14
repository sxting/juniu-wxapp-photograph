// pages/collage/product-list/product-list.js
import { constant } from '../../../utils/constant';
import { collageService } from '../shared/collage.service';


Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '/asset/images/product.png',
    jnImgUrl: '/asset/images/product.png',
    collageProductList: [],
    storeId: '',
    belongTo: '',//商家ID
    buyerId: '',//用户id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '拼团列表',
    })
    this.data.storeId = wx.getStorageSync(constant.STORE_INFO);
    this.data.belongTo = wx.getStorageSync(constant.MERCHANTID);
    this.data.buyerId = wx.getStorageSync(constant.USER_ID);

    this.setData({
      storeId: this.data.storeId,
    })
    let self = this;
    let data = {
      storeId: this.data.storeId,
      belongTo: this.data.belongTo,
      buyerId: this.data.buyerId,
      pageSize: 1000,
      platform: 'WECHAT_SP'
    }
    collageService.getProductList(data).subscribe({
      next: res => {
        if(res){
          console.log(res.elements);
          res.elements.forEach(function(item){
            if (item.activityName && item.activityName.length > 8){
              item.activityName = item.activityName.substring(0, 8) + '...';
            }
            item.cover = item.cover && item.cover.substring(0, 4) === 'http' ? item.cover : constant.OSS_IMAGE_URL + `${item.cover}/resize_110_83/mode_fill`;
          })
          this.setData({
            collageProductList: res.elements
          })
        }
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },

  // 去开团
  goToCollageBtn: function (e) {
    console.log(e.currentTarget.dataset.activityid);
    wx.navigateTo({
      url: '/pages/collage/product-detail/product-detail?activityId=' + e.currentTarget.dataset.activityid
    })
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  }

})