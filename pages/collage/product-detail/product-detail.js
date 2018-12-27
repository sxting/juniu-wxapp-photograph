// pages/personal/comment/detail/detail.js
import { collageService } from '../shared/collage.service';
import { errDialog, loading } from '../../../utils/util';
import { constant } from '../../../utils/constant';
import { homeService } from '../../home/shared/service.js';
import { service } from '../../../service';
import { productService } from '../../product/shared/service.js';
import { formidService } from '../../../shared/service/formid.service.js';
const app = getApp()
let timer1;
let timer2;

Page({
  data: {
    jnImg: '/asset/images/product.png',
    storeName: wx.getStorageSync('storeName'),
    address: '',
    merchantPid: wx.getStorageSync(constant.MERCHANTID),
    pinTuanId: '',
    groupId: '', //通过分享的链接点进来 带的参数； 通过 来判断高级插件区点进来的还是分享的链接点进来的
    joinNumber: 0,
    qmArr: [],
    sharedHours: '',
    sharedMinites: '',
    sharedSeconds: '',
    sharedTime: '',
    data: '',
    tel: '',
    length: 0,
    presentPrice: '',//现价
    originalPrice: '',//原价
    showAlert: false,
    collageList: [],
    imgs: [],  //轮播图
    productImgs: [],  //商品详情
    sharedPicUrl: [],
    applyStores: [],
    token: wx.getStorageSync(constant.TOKEN),
    getUserInfo: true,
    pageIndex: 1,
    pageSize: 10,
    countPage: 1,
    productId: '',
    showBtn: false,
    showStore:true,
    shared: false,
  },

  onShow: function () {
    let self = this;
    if (this.data.shared) {
      clearInterval(timer1);
      clearInterval(timer2);
      this.setData({
        qmArr : []
      })
      wx.getSetting({
        success: res => { 
          if (res.authSetting['scope.userInfo']) {
            let callbackFun = function () {
              getProductDetail.call(self);
              getStoreInfo.call(self)
            };
            wx.login({
              success: function (result) {
                wx.getUserInfo({
                  success: res => {
                    service.logInFun(result.code, res.rawData, callbackFun);
                  },
                  fail: () => { }
                })
              }
            });
          } else {
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '项目详情',
    })
    this.setData({
      qmArr : []
    })
    this.setData({
      storeName: wx.getStorageSync('storeName'),
      pinTuanId: options.activityId ? options.activityId : '',
      groupId: options.groupId ? options.groupId : '',
    })
    getProductCommentList.call(this);

    let self = this;
    if(!this.data.shared) {
      if (options.type == 'share') {
        wx.setStorageSync(constant.STORE_INFO, options.storeId)
        this.setData({
          showBtn: true
        })

        setTimeout(function() {
          self.setData({
            shared: true
          })
        }, 500)

        wx.getSetting({
          success: res => {
            // 如果授权  则直接登录  
            if (res.authSetting['scope.userInfo']) {
              let callbackFun = function () {
                getProductDetail.call(self);
                getStoreInfo.call(self)
              };
              wx.login({
                success: function (result) {
                  wx.getUserInfo({
                    success: res => {
                      service.logInFun(result.code, res.rawData, callbackFun);
                    },
                    fail: () => { }
                  })
                }
              });
            } else {
              wx.navigateTo({
                url: '/pages/index/index',
              })
            }
          }
        })
      } else {
        getProductDetail.call(this);
        if (wx.getStorageSync(constant.STORE_INFO)) {
          getStoreInfo.call(this)
        }
      }
    }
  },

  onStoreClick() {
    this.setData({
      showStore: false
    })
  },

  formSubmit: function (e) {
    let formId = e.detail.formId; //获取formId
    formidService.collectFormIds(formId).subscribe({
      next: res => { }
    })
  },

  routerToStoreIndex() {
    this.setData({
      showStore: true,
    })
  },
  /** 返回首页 */
  comeBackHome() {
    wx.reLaunch({
      url: '/pages/home/home'
    })
    if (app.userInfoReadyCallback) {
      app.userInfoReadyCallback(res)
    }
  },

  // 拨打电话
  onTelClick() {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.tel
    })
  },

  bindgetuserinfo(e) {
    let self = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.login({
        success: function (result) {
          self.setData({
            getUserInfo: true
          })
          let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
          let appId = 'wx3bb038494cd68262';
          if (result.code) {
            logIn.call(self, result.code, extConfig.theAppid ? extConfig.theAppid : appId, e.detail.rawData);
          } else {
            console.log('获取用户登录态失败！' + result.errMsg)
          }
        },
        fail: function (res) {
          self.setData({
            getUserInfo: false
          })
        },
        complete: function (res) { },
      });
    }
  },

  onShareAppMessage: function (res) {
    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/collage/product-detail/product-detail?type=share&storeId=' + wx.getStorageSync(constant.STORE_INFO) + '&activityId=' + this.data.pinTuanId,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    }
  },

  onScrollTolower: function () {
    if (this.data.pageIndex == this.data.countPage) {
      return;
    }
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    getProductCommentList.call(this)
  },

  // 开团 
  onOpenGroupBtnClick() {
    let data = this.data.data, 
      pic = this.data.imgs[0].url ? this.data.imgs[0].url : this.data.jnImg,
    pTId = this.data.pinTuanId, 
    actName = data.activityName,
    ppN = data.peopleCount,
    dGN = data.openedGroupCount,
      aPrice = data.product.activityPrice,
      oPrice = data.product.originalPrice ;
    
    wx.navigateTo({
      url: `/pages/collage/collage-submit/collage-submit?pic=${pic}&pinTuanId=${pTId}&activityName=${actName}&peopleNumber=${ppN}&dealGroupNumber=${dGN}&activityPrice=${aPrice}&originalPrice=${oPrice}`,
    })
  },

  //参团 
  onGoJoinCollageClick(e) {
    let data = this.data.data,
      pic = this.data.imgs[0].url ? this.data.imgs[0].url : this.data.jnImg,
      pTId = this.data.pinTuanId,
      actName = data.activityName,
      ppN = data.peopleCount,
      dGN = data.openedGroupCount,
      aPrice = data.product.activityPrice,
      oPrice = data.product.originalPrice,
      groupId = e.currentTarget.dataset.groupid ? e.currentTarget.dataset.groupid : this.data.groupId;

    wx.navigateTo({
      url: `/pages/collage/collage-submit/collage-submit?pic=${pic}&pinTuanId=${pTId}&activityName=${actName}&peopleNumber=${ppN}&dealGroupNumber=${dGN}&activityPrice=${aPrice}&originalPrice=${oPrice}&groupId=${groupId}`,
    })
  },
})

function getProductDetail() {  
  let data = {
    activityId: this.data.pinTuanId,
    storeId: wx.getStorageSync(constant.STORE_INFO),
    belongTo: wx.getStorageSync(constant.MERCHANTID),
    buyerId: wx.getStorageSync(constant.USER_ID),
    platform: 'WECHAT_SP'
  };
  if (this.data.groupId) {
    data.groupId = this.data.groupId
  }

  let self = this;
  collageService.getProductDetail(data).subscribe({
    next: res => {
      if (res) {
        self.setData({
          data: res
        })

        if (res.openedGroups && res.openedGroups.length) {
          self.setData({
            length: res.openedGroups.length
          })
        }        

        let length = 0;

        if (self.data.groupId && self.data.data.currentGroup) {
          let data2 = self.data.data;

          if (data2.currentGroup.orderStatus == 'PAID' && data2.currentGroup.orderNo && data2.currentGroup.groupStatus == 'FINISH') {
            wx.navigateTo({
              url: '/pages/personal/collage-order/detail/detail?show=true&orderNo=' + data2.currentGroup.orderNo,
            })
          }

          data2.currentGroup.expireTime = data2.currentGroup.expireTime.replace(/-/g, '/');
          
          length = data2.currentGroup.picUrls.length;

          if (length < data2.peopleCount && data2.currentGroup.groupStatus == 'FINISH') {
            let num = randomNum.call(self, 1, 5);
            for (let i = 0; i < (data2.peopleCount - length); i++) {
              data2.currentGroup.picUrls.push(`/asset/images/pintuan_head${num}.jpg`)
            }
          }
          self.setData({
            data: data2
          })
        }        

        self.setData({
          presentPrice: res.product.activityPrice / 100,
          originalPrice: res.product.originalPrice / 100,
          joinNumber: length
        })                

        let nowTime = new Date();

        if (self.data.data.picUrls) {
          let imgs = []
          self.data.data.picUrls.forEach(function (item) {
            imgs.push(
              { url: `${constant.OSS_IMAGE_URL}${item}/resize_750_520/mode_fill` }
            )
          });
          self.setData({
            imgs: imgs
          })
        }

        if (self.data.data.product.picIds) {
          let productImgs = []
          self.data.data.product.picIds.forEach(function (item) {
            productImgs.push(
              { url: `${constant.OSS_IMAGE_URL}${item}/resize_650_300/mode_fill` }
            )
          });
          self.setData({
            productImgs: productImgs
          })
        }        

        self.setData({
          applyStores: self.data.data.applyStores,
          collageList: self.data.data.openedGroups
        })

        /*倒计时*/
        if (!self.data.groupId) {
          self.data.collageList.forEach(function (item) {
            item.expireTime = item.expireTime.replace(/-/g, '/');
            let time = new Date(item.expireTime).getTime() - nowTime.getTime();
            if (time <= 0) {
              item.time = '00:00:00'
            } else {
              let hours = parseInt(time / 1000 / 60 / 60 + '');
              let minutes = parseInt(time / 1000 / 60 - hours * 60 + '');
              let seconds = parseInt(time / 1000 - minutes * 60 - hours * 3600 + '');
              item.time = (hours.toString().length < 2 ? '0' + hours : hours) + ':' +
                (minutes.toString().length < 2 ? '0' + minutes : minutes) + ':' +
                (seconds.toString().length < 2 ? '0' + seconds : seconds);
            }
          });

          if (self.data.collageList && self.data.collageList.length > 0) {
            timer1 = setInterval(function () {
              self.data.collageList.forEach(function (item) {
                if (new Date('2000/01/01 ' + item.time).getHours().toString() === '0' && new Date('2000/01/01 ' + item.time).getMinutes().toString() === '0' && new Date('2000/01/01 ' + item.time).getSeconds().toString() === '0') {
                  item.time = '00:00:00';
                  self.setData({
                    collageList: self.data.collageList
                  })
                } else {
                  let time = new Date(new Date('2000/01/01 ' + item.time).getTime() - 1000);
                  item.time =
                    (time.getHours().toString().length < 2 ? '0' + time.getHours() : time.getHours()) + ':' +
                    (time.getMinutes().toString().length < 2 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
                    (time.getSeconds().toString().length < 2 ? '0' + time.getSeconds() : time.getSeconds());

                  self.setData({
                    collageList: self.data.collageList
                  })
                }
              })

            }, 1000)
          }; 
        }

        if (self.data.groupId) {
          if (self.data.data.peopleCount > 4) {
            if (length >= 3) {

            } else {
              for (let i = 0; i < 3 - length; i++) {
                self.data.qmArr.push('')
              }
            }
          } else {
            for (let i = 0; i < self.data.data.peopleCount - length; i++) {
              self.data.qmArr.push('')
            }
          }

          let time2 = new Date(self.data.data.currentGroup.expireTime).getTime() - nowTime.getTime();
          if (time2 <= 0) {
            self.data.sharedHours = '00';
            self.data.sharedMinites = '00';
            self.data.sharedSeconds = '00';
          } else {
            let a = time2 / 1000 / 60 / 60;
            let hours = parseInt(a + '');
            let minutes = parseInt(time2 / 1000 / 60 - hours * 60 + '');
            let seconds = parseInt(time2 / 1000 - minutes * 60 - hours * 3600 + '');
            self.data.sharedHours = hours.toString().length < 2 ? '0' + hours : hours;
            self.data.sharedMinites = minutes.toString().length < 2 ? '0' + minutes : minutes;
            self.data.sharedSeconds = seconds.toString().length < 2 ? '0' + seconds : seconds;
          }

          //倒计时
          timer2 = setInterval(function () {
            if (new Date('2000/01/01 ' + self.data.sharedHours + ':' + self.data.sharedMinites + ':' + self.data.sharedSeconds).getHours().toString() === '0' && new Date('2000/01/01 ' + self.data.sharedHours + ':' + self.data.sharedMinites + ':' + self.data.sharedSeconds).getMinutes().toString() === '0' && new Date('2000/01/01 ' + self.data.sharedHours + ':' + self.data.sharedMinites + ':' + self.data.sharedSeconds).getSeconds().toString() === '0') {
              self.data.sharedHours = '00';
              self.data.sharedMinites = '00';
              self.data.sharedSeconds = '00';
            } else {
              let time = new Date(new Date('2000/01/01 ' + self.data.sharedHours + ':' + self.data.sharedMinites + ':' + self.data.sharedSeconds).getTime() - 1000);
              self.data.sharedHours = time.getHours().toString().length < 2 ? '0' + time.getHours() : time.getHours();
              self.data.sharedMinites = time.getMinutes().toString().length < 2 ? '0' + time.getMinutes() : time.getMinutes();
              self.data.sharedSeconds = time.getSeconds().toString().length < 2 ? '0' + time.getSeconds() : time.getSeconds();
            }
            self.setData({
              sharedHours: self.data.sharedHours,
              sharedMinites: self.data.sharedMinites,
              sharedSeconds: self.data.sharedSeconds
            })
          }, 1000);

          self.setData({
            qmArr: self.data.qmArr,
            sharedHours: self.data.sharedHours,
            sharedMinites: self.data.sharedMinites,
            sharedSeconds: self.data.sharedSeconds
          })
        }
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

//获取门店信息
function getStoreInfo() {
  let self = this;
  let data = {
    storeId: wx.getStorageSync(constant.STORE_INFO)
  }
  homeService.storeInfoDetail(data).subscribe({
    next: res => {
      self.setData({
        address: res.address,
        tel: res.mobile
      });
      wx.setStorageSync(constant.address, res.address)
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

function logIn(code, appid, rawData) {
  let self = this;
  service.logIn({ code: code, appid: appid, rawData: rawData, tplid: constant.TPLID }).subscribe({
    next: res => {
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      wx.setStorageSync(constant.MERCHANTID, res.merchantId ? res.merchantId : '153179997107784038184');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);
      wx.setStorageSync(constant.sessionKey, res.sessionKey)

      if (res.ver == '2') {
        wx.setStorageSync(constant.VER, 2);
      } else {
        wx.setStorageSync(constant.VER, 1);
      }

      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (res) {
          getProductDetail.call(self);
          getStoreInfo.call(self)
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

//商品评价列表
function getProductCommentList() {
  let data = {
    pageIndex: this.data.pageIndex,
    pageSize: this.data.pageSize,
    storeId: wx.getStorageSync(constant.STORE_INFO),
    activityId: this.data.pinTuanId
  }
  productService.getProductCommentList(data).subscribe({
    next: res => {
      res.comments.forEach((item) => {
        let dateArray = item.juniuoModel.dateCreated.split(' ');
        item.date = dateArray[0];
        item.time = dateArray[1];

        if (item.imagesUrl) {
          item.imagesUrl.forEach((img, index) => {
            item.imagesUrl[index] = constant.OSS_IMAGE_URL + `${img}/resize_71_72/mode_fill`;
          });
        }
      });

      this.setData({
        commentList: res.comments,
        countPage: res.pageInfo.countPage
      })

    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
} 

//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
