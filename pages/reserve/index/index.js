import { orderService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';
import { constant } from '../../../utils/constant';
import { service } from '../../../service';

Page({
  data: {
    nowTime: new Date().getTime(),
    storeId: '',
    storeName: '',
    reserveType: '', //预约配置类型 MAN、PRODUCT、TIME 
    productIds: '',
    dateList: [],
    date: '', //选择的日期
    timeList: {
      time: [],
      timeShow: []
    },
    time: '', //选择的时间
    productId: '',
    productName: '',
    price: '',
    tel: '', //手机号
    note: '',  //备注
    peopleNumber: '1', //预约人数
    isToday: true,
    success: false,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  },

  onShow: function () {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('storeName'),
    })
    let today = changeDate.call(this, new Date());
    let dateArr = [];
    for (let i = 0; i < 7; i++) {
      dateArr.push(getAfterSomeDay.call(this, today, i))
    }

    dateArr[0].week = '今';
    dateArr[1].week = '明';

    this.setData({
      storeId: wx.getStorageSync(constant.STORE_INFO),
      dateList: dateArr,
      date: dateArr[0].dateData,
      productId: wx.getStorageSync('productId'),
      productName: wx.getStorageSync('productName'),
      price: wx.getStorageSync('reservePrice'),
      nowTime: new Date().getTime()
    })

    wx.removeStorageSync('productId');
    wx.removeStorageSync('productName');
    wx.removeStorageSync('reservePrice');

    reserveConfig.call(this);
  },

  //授权手机号 
  getUserPhoneNumber: function (e) {
    console.log(e);
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    let data = {
      encryptData: encryptedData,
      iv: iv
    }
    service.decodeUserPhone(data).subscribe({
      next: res => {
        this.setData({
          tel: res.phoneNumber
        })
        wx.setStorageSync(constant.phoneNumber, res.phoneNumber)
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },

  // 选择手艺人
  onCraftsmanClick: function () {
    wx.navigateTo({
      url: '/pages/craftsman/select/select?label=order&storeId=' + this.data.storeId,
    })
  },

  // 选择商品
  onProductClick: function (e) {
    if (this.data.reserveType === 'MAN' && !this.data.craftsmanId) {
      errDialog('请选择手艺人');
      return;
    }
    if (this.data.reserveType === 'MAN') {
      wx.navigateTo({
        url: `/pages/product/select/select?craftsmanId=${this.data.craftsmanId}&craftsmanName=${this.data.craftsmanName}&storeId=${this.data.storeId}&from=order`,
      })
    } else if (this.data.reserveType === 'PRODUCT') {
      wx.navigateTo({
        url: `/pages/product/select/select?productIds=${this.data.productIds}&storeId=${this.data.storeId}&from=order`,
      })
    }
  },

  // 选择日期
  onDateClick: function (e) {
    console.log(e)
    if (this.data.showPreventBox) { return; }
    this.setData({
      date: e.currentTarget.dataset.date
    })

    let today = new Date();
    let date = new Date(e.currentTarget.dataset.date + ' ' + '00:00:00')
    // tslint:disable-next-line:max-line-length
    if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
      this.setData({
        isToday: true
      })
    } else {
      this.setData({
        isToday: false
      })
    }

    if (this.data.reserveType === 'MAN') {
      getStaffReserve.call(this);
    }

  },

  // 选择时间
  onTimeClick: function (e) {
    if (this.data.showPreventBox) { return; }
    let index = e.currentTarget.dataset.index;
    let reserve = e.currentTarget.dataset.reserve;
    if (this.data.timeList.time[index] < this.data.nowTime && this.data.isToday || reserve) {
      this.setData({
        time: ''
      });
      return;
    }
    this.setData({
      time: e.currentTarget.dataset.time
    })
  },

  // 填写手机号
  onTelChange: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },

  // 填写备注
  onNoteChange: function (e) {
    this.setData({
      note: e.detail.value
    })
  },

  // 确认预约
  onCommitBtnClick: function () {
    if (!this.data.time) {
      errDialog('请选择时间'); return;
    }
    if (!this.data.tel) {
      errDialog('请填写手机号'); return;
    }
    if ((this.data.tel + '').length !== 11) {
      errDialog('请填写正确的手机号'); return;
    }

    saveReserve.call(this)
  },

  successYBtnClick() {
    this.setData({
      success: false,
    })
    wx.navigateTo({
      url: '/pages/personal/appointment/appointment',
    })
  },
  successNBtnClick() {
    this.setData({
      success: false,
    })
    reserveConfig.call(this);
  }

})

// 查询店铺预约配置
function reserveConfig() {
  let data = {
    storeId: this.data.storeId
  }
  orderService.reserveConfig(data).subscribe({
    next: res => {
      let todayDay = changeDate.call(this, new Date())
      let timeArr = {
        time: [],
        timeShow: []
      };

      //生成时间start
      let timeData = res.businessStart + '-' + res.businessEnd;
      // let timeData = '09:00-19:30';
      let timeDataArr = timeData.split('-');
      let startTime = new Date(todayDay + ' ' + timeDataArr[0]).getTime();
      let endTime = new Date(todayDay + ' ' + timeDataArr[1]).getTime();


      for (let i = 0; i < ((endTime - startTime) / 1000 / 60 / 30); i++) {
        timeArr.timeShow.push(new Date(new Date(todayDay + ' ' + timeDataArr[0]).getTime() + 30 * 60 * 1000 * i));
        timeArr.time.push(new Date(new Date(todayDay + ' ' + timeDataArr[0]).getTime() + 30 * 60 * 1000 * i).getTime());
      }
      for (let i = 0; i < timeArr.timeShow.length; i++) {
        timeArr.timeShow[i] = {
          time: (timeArr.timeShow[i].getHours().toString().length > 1 ? timeArr.timeShow[i].getHours() : '0' + timeArr.timeShow[i].getHours()) + ':' +
            (timeArr.timeShow[i].getMinutes().toString().length > 1 ? timeArr.timeShow[i].getMinutes() : '0' + timeArr.timeShow[i].getMinutes()),
          reserve: false
        }
      }

      this.setData({
        reserveType: res.reserveType,
        productIds: res.productIds,
        timeList: timeArr
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 保存预约信息
function saveReserve() {
  let data = {
    storeId: this.data.storeId,
    storeName: this.data.storeName,
    date: this.data.date,
    time: this.data.time + ':00',
    note: this.data.note,
    phone: this.data.tel,
    peopleNumber: this.data.peopleNumber,
    reservationsType: 'RESERVE',
    reserveType: this.data.reserveType,
    productId: this.data.productId,
    productName: this.data.productName
  }
  if (this.data.reserveType === 'TIME') {
    delete data.productId;
    delete data.productName;
  }
  let self = this;
  orderService.saveReserve(data).subscribe({
    next: res => {
      if (res) {
        self.setData({
          success: true
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 获取未来N天的日期
function getAfterSomeDay(date, num) {
  date = date.replace(/-/g, '/');
  let odate = new Date(date);
  odate = odate.valueOf();
  odate = odate + num * 24 * 60 * 60 * 1000;
  odate = new Date(odate);
  let dateNum = odate.getDate() < 10 ? '0' + odate.getDate() : odate.getDate();
  if ((odate.getMonth() + 1) >= 10) {
    return {
      date: (odate.getMonth() + 1) + '.' + dateNum,
      year: odate.getFullYear(),
      day: dateNum,
      week: changeDayToChinese.call(this, odate.getDay()),
      dateData: odate.getFullYear() + '-' + (odate.getMonth() + 1) + '-' + dateNum
    };
  } else {
    return {
      date: '0' + (odate.getMonth() + 1) + '.' + dateNum,
      year: odate.getFullYear(),
      day: dateNum,
      week: changeDayToChinese.call(this, odate.getDay()),
      dateData: odate.getFullYear() + '-' + '0' + (odate.getMonth() + 1) + '-' + dateNum
    };
  }
}

//将日期时间戳转换成日期格式
function changeDate(date) {
  console.log(date);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return year + '/' + (month.toString().length > 1 ? month : ('0' + month)) + '/' + (day.toString().length > 1 ? day : ('0' + day));
}

// 星期数字转换为文字
function changeDayToChinese(num) {
  let result = '';
  switch (num) {
    case 0:
      result = '日';
      break;
    case 1:
      result = '一';
      break;
    case 2:
      result = '二';
      break;
    case 3:
      result = '三';
      break;
    case 4:
      return '四';
    case 5:
      result = '五';
      break;
    case 6:
      result = '六';
      break;
  }
  return result;
}