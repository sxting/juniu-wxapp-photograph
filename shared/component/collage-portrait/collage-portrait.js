// shared/component/collage-portrait/collage-portrait.js
export default Component({

  properties: {
    fleg: {
      type: String,
      value: ''
    },
    arrCollageImage: {
      type: Array,
      value: ['/asset/images/product.png', '/asset/images/product.png', '/asset/images/product.png']
    },
    collageNumber: {
      type: Number,
      value: 8
    },
  },

  data: {
    remainingCollagesNumber: 0,//剩余可拼团人数
    remainingCollages: [],
    showAlert: false,
  },

  methods: {
    moreBtnClick() {
      this.setData({
        showAlert: true
      });
      this.data.remainingCollages = [];
      this.data.remainingCollagesNumber = this.data.collageNumber - this.data.arrCollageImage.length;
      if (this.data.remainingCollagesNumber > 0) {
        for (let i = 0; i < this.data.remainingCollagesNumber; i++) {
          let list = '';
          this.data.remainingCollages.push(list);
        }
      }
      this.setData({
        remainingCollagesNumber: this.data.remainingCollagesNumber,
        remainingCollages: this.data.remainingCollages
      })
    },

    closeBtn() {
      this.setData({
        showAlert: false
      })
    }
  }
})