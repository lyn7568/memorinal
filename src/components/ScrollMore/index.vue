<template lang="html">
  <div class="yo-scroll" @touchstart="touchStart($event)" ref="scrollBox"
        @touchmove="touchMove($event)" @touchend="touchEnd($event)" :style="{top: topVal+'px'}" :loading="dataList.loading">
    <section class="inner" ref="contentBox">
      <slot>
      </slot>
      <footer class="load-more">
        <slot name="load-more">
          <span>{{loadMoreText}}</span>
        </slot>
      </footer>
      <div class="nullData" v-show="dataList.noFlag">暂无更多数据</div>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    offset: {
      type: Number,
      default: 100 //默认高度
    },
    enableLoadMore: {
      type: Boolean,
      default: true
    },
    dataList: {
      default: false,
      required: false
    },
    onLoadMore: {
      type: Function,
      default: undefined,
      require: false
    },
    topVal: {
      type: String,
      default: '40',
    }
  },
  data() {
    return {
      startX: 0,
      startY: 0,
      touching: false,
      isLoading: false,
      loadMoreText: '上拉加载更多'
    };
  },
  mounted() {
    this.scrollBottomTest()
  },
  methods: {
    setSlideHeight() {
      this.slideH = window.innerHeight + 'px'
    },
    touchStart(e) {
      this.startY = e.targetTouches[0].pageY;
      this.startX = e.targetTouches[0].pageX;
      this.startScroll = this.$el.scrollTop || 0;
      this.touching = true; //留着有用，不能删除
      // this.dataList.noFlag = false;
    },
    //滑动中
    touchMove(e) {
      if (!this.enableLoadMore || this.dataList.noFlag || !this.touching) {
        return;
      }
      let diff = e.targetTouches[0].pageY - this.startY - this.startScroll;
      if (diff > 0) {
        e.preventDefault();
      }
      this.loadMoreText = '上拉加载更多';
      this.$el.querySelector('.load-more').style.display = 'block';
    },

    touchEnd(e) {
      if (this.isLoading) {
        return;
      }
      this.touching = false;

      //用于判断滑动是否在原地 ----begin
      let endX = e.changedTouches[0].pageX,
        endY = e.changedTouches[0].pageY,
        dy = this.startY - endY,
        dx = endX - this.startX;

      //如果滑动距离太短
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        let more = this.$el.querySelector('.load-more');
        more.style.display = 'none'; //隐藏加载条
        return;
      }

      if (!this.enableLoadMore || this.isLoading) {
        let more = this.$el.querySelector('.load-more');
        more.style.display = 'none'; //隐藏加载条
        return;
      }

      let outerHeight = this.$el.clientHeight,
        innerHeight = this.$el.querySelector('.inner').clientHeight,
        scrollTop = this.$el.scrollTop,
        bottom = innerHeight - outerHeight - scrollTop - 50;
      if (bottom <= this.offset && !this.dataList.noFlag && !this.isLoading ) {
        //内容太少
        this.doLoadMore();
      } else {
        let more = this.$el.querySelector('.load-more');
        more.style.display = 'none'; //隐藏加载条
      }
    },
    doLoadMore() {
      this.isLoading = true;
      this.loadMoreText = '正在加载';
      this.onLoadMore(this.loadDone);
    },
    loadDone() {
      this.isLoading = false;
      let more = this.$el.querySelector('.load-more');
      more.style.display = 'none'; //隐藏加载条
    },
    scrollBottomTest() {
      var that = this
      var elbody = this.$refs.scrollBox
      var conbody = this.$refs.contentBox
      elbody.addEventListener('scroll', () => {
        var viewH = elbody.clientHeight, // 可视高度
          contentH = conbody.scrollHeight, // 内容高度
          scrollTop = elbody.scrollTop; // 滚动高度
        if (scrollTop / (contentH -viewH) >= 1 && !that.dataList.noFlag && !that.dataList.loading && !that.isLoading ) { //到达底部时,加载新内容
          that.doLoadMore();
        }
      })
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
// /*:class="{'down':(state===0),'up':(state==1),refresh:(state===2),touch:touching}"*/
.yo-scroll {
  position: absolute; //关键
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto; //关键
  z-index: 100;
  height: auto;
  -webkit-overflow-scrolling: touch;
  .inner {
    position: absolute;
    /*top: -5rem;*/
    width: 100%;
    height: auto;
    padding-bottom: 5em;
    transition-duration: 300ms;
    .load-more {
      height: 5em;
      line-height: 5em;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      display: none;
      font-size: 13px;
      color: #999999;
    }
    .nullData {
      //暂无更多数据样式
      font-size: 13px;
      color: #999999;
      height: 5em;
      line-height: 5em;
      text-align: center;
    }
    .down-tip,
    .refresh-tip,
    .up-tip {
      display: none;
    }
  }
}

.yo-scroll.touch .inner {
  transition-duration: 0;
}

.yo-scroll.down .down-tip {
  display: block;
}

.yo-scroll.up .up-tip {
  display: block;
}

.yo-scroll.refresh .refresh-tip {
  display: block;
}
</style>
