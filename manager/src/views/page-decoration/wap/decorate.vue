<template>
  <div class="decorate">
    <div class="decorate-title">
      {{ res.name }}

      <Button
        style="margin-left: 20px"
        size="small"
        ghost
        v-if="
          res.type == 'tpl_ad_list' ||
          res.type == 'tpl_activity_list' ||
          res.drawer
        "
        type="primary"
        @click="selectStyle()"
        >select风格</Button
      >
      <Button
        style="margin-left: 20px"
        size="small"
        ghost
        v-if="res.type == 'promotions' || res.drawerPromotions"
        type="primary"
        @click="selectPromotions()"
        >select促销活动</Button
      >
    </div>
    <Alert type="warning" v-if="res.name == 'Goods Category'"
      >装修Tips
      <template slot="desc">
        <div style="color: red">
          如果当前装修模块不是最后一项模块且模块内容绑定为分类，则会default展示绑定分类的100itemsGoods details。
        </div>
        <div style="color: red">
          如果当前装修模块是最后一项模块且模块内容绑定为分类，则会default会根据绑定分类触底加载Goods details。
        </div>
        <div style="color: red">
          如果当前装修内容不为分类，则会展示当前Goods的静态信息。
        </div>
      </template>
    </Alert>

    <!-- 右侧显示抽屉 -->
    <Drawer title="select风格" :closable="false" width="400" v-model="styleFlag">
      <div class="drawer">
        <div
          class="drawer-item"
          @click="clickDrawer(item, index)"
          v-for="(item, index) in modelData"
          :key="index"
          v-if="item.drawer"
        >
          <img src alt />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </Drawer>

    <!-- 右侧显示抽屉 -->
    <Drawer
      title="select促销活动(最多只能展示两个活动)"
      :closable="false"
      width="400"
      v-model="promotionsFlag"
    >
      <div class="drawer">
        <div
          class="drawer-item"
          @click="clickDrawer(item, index)"
          v-for="(item, index) in modelData"
          :key="index"
          v-if="item.drawerPromotions"
        >
          <img src alt />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </Drawer>

    <!-- 卡片集合 -->
    <div
      class="decorate-list"
      v-if="
        (res.type != 'tpl_ad_list' &&
          res.type != 'tpl_activity_list' &&
          res.type != 'promotions') ||
        res.drawer ||
        res.drawerPromotions
      "
    >
      <div
        class="decorate-item"
        v-for="(item, index) in res.options.list"
        :key="index"
      >
        <div class="decorate-item-title">
          <div>卡片</div>
          <Icon
            @click="closeDecorate(index)"
            v-if="res.close || res.type == 'promotionDetail'"
            size="20"
            color="#e1251b"
            type="md-close-circle"
          />
        </div>

        <div class="decorate-item-box">
          <div
            class="decorate-border"
            v-if="item.titleWay"
            v-for="(title_item, title_index) in item.titleWay"
            :key="title_index"
          >
            <div class="decorate-view">
              <div class="decorate-view-title">标题{{ title_index + 1 }}</div>
              <div>
                <Input v-model="title_item.title" />
              </div>
            </div>
            <div class="decorate-view">
              <div class="decorate-view-title">描述</div>
              <div>
                <Input v-model="title_item.desc" />
              </div>
            </div>
            <div class="decorate-view">
              <div class="decorate-view-title">绑定</div>
              <div class="decorate-view-link">
                <div v-if="res.options.list[0].listWay.length != 0">
                  <!-- 绑定Goodsselect器回调已selectgoods -->

                  <div
                    v-if="
                      title_item.___index == bindGoods.___index ||
                      title_item.title == bindGoods.type
                    "
                    v-for="(bindGoods, bindGoodsIndex) in res.options.list[0]
                      .listWay"
                    :key="bindGoodsIndex"
                    class="title-item wes-2"
                  >
                    <Tooltip max-width="200" placement="left">
                      <div slot="content" class="title-tooltip">
                        {{ bindGoods.title }}
                      </div>
                      <div class="title-goodsName">
                        {{ bindGoods.title }}
                      </div>
                    </Tooltip>
                    <div class="title-btn">
                      <Button
                        @click="
                          slotGoods(
                            res.options.list[0].listWay,
                            title_item.___index,
                            bindGoods,
                            'up'
                          )
                        "
                        style="margin-right: 10px"
                        size="small"
                        >上移</Button
                      >
                    </div>
                  </div>
                </div>
                <!-- 显示绑定分类 -->
                <div v-if="title_item.bindCategory">
                  绑定分类为：{{ title_item.bindCategory.name }}
                </div>
              </div>

              <div class="decorate-view-btn">
                <Button
                  @click="bindGoodsId(title_item, title_index)"
                  size="small"
                  >selectGoods</Button
                >
                <Button
                  @click="bindGoodsCategory(title_index)"
                  size="small"
                  style="margin-top: 20px"
                  >select分类</Button
                >
              </div>
            </div>
          </div>
          <div class="decorate-view" v-if="res.type == 'carousel'">
            <div class="decorate-view-title">
              <Button
                @click="slotBanner(res, item, index, 'up')"
                style="margin-right: 10px"
                size="small"
                >上移</Button
              ><Button
                @click="slotBanner(res, item, index, 'down')"
                size="small"
                >下移</Button
              >
            </div>
          </div>
          <!-- select照片 -->
          <div class="decorate-view" v-if="!res.notImg">
            <div class="decorate-view-title">select照片</div>
            <div>
              <img class="show-image" :src="item.img" alt />

              <div class="tips" v-if="!res.onlyImg">
                建议尺寸
                <span>{{ item.size }}</span>
              </div>
            </div>
            <div class="selectBtn">
              <Button
                size="small"
                @click="handleClickFile(item, index)"
                ghost
                type="primary"
                >select照片</Button
              >
            </div>
          </div>
          <div
            class="decorate-view"
            v-if="item.title != void 0 && !res.notTitle && res.type == 'title'"
          >
            <div class="decorate-view-title">文字对齐方式</div>
            <div class="card-box">
              <div
                class="card"
                :class="{ active: textAlign == 'left' }"
                @click="changeTextAlign('left')"
              >
                <img
                  :src="require('@/assets/align-text-left.png')"
                  class="align-text"
                  alt=""
                />
              </div>
              <div
                class="card"
                :class="{ active: textAlign == 'center' }"
                @click="changeTextAlign('center')"
              >
                <img
                  :src="require('@/assets/align-text-center.png')"
                  class="align-text"
                  alt=""
                />
              </div>
              <!-- <div
                class="card"
                :class="{ active: textAlign == 'right' }"
                @click="changeTextAlign('right')"
              >
                <img
                  :src="require('@/assets/align-text-right.png')"
                  class="align-text"
                  alt=""
                />
              </div> -->
            </div>
          </div>
          <div
            class="decorate-view"
            v-if="
              item.title != void 0 &&
              !res.notTitle &&
              (res.type == 'title' ||
                res.type == 'notice' ||
                res.type == 'promotionDetail')
            "
          >
            <div class="decorate-view-title">背景颜色</div>
            <div class="decorate-view">
              <ColorPicker v-model="item.bk_color" />
              <Input v-model="item.bk_color" />
            </div>
          </div>
          <div
            class="decorate-view"
            v-if="item.title != void 0 && !res.notTitle && res.type == 'notice'"
          >
            <div class="decorate-view-title">方向</div>
            <div class="decorate-view">
              <Select
                style="width: 200px"
                @on-change="changeDirection($event, item)"
                v-model="item.direction"
              >
                {{ item.direction }}
                <Option label="横向" value="horizontal"></Option>
                <Option label="纵向" value="vertical"></Option>
              </Select>
            </div>
          </div>

          <!-- enter 标题 -->
          <div
            class="decorate-view"
            v-if="item.title != void 0 && !res.notTitle && res.type != 'notice'"
          >
            <div class="decorate-view-title">菜单标题</div>
            <div>
              <Input v-model="item.title" style="width: 200px" />
            </div>
          </div>
          <div
            class="decorate-view"
            v-if="
              item.title != void 0 &&
              !res.notTitle &&
              (res.type == 'title' || res.type == 'notice')
            "
          >
            <div class="decorate-view-title">标题颜色</div>
            <div class="decorate-view">
              <ColorPicker v-model="item.color" />
              <Input v-model="item.color" />
            </div>
          </div>
          <!-- enter 小标题 -->
          <div
            class="decorate-view"
            v-if="item.title1 != void 0 && !res.notTitle"
          >
            <div class="decorate-view-title">小标题</div>
            <div>
              <Input v-model="item.title1" style="width: 200px" />
            </div>
          </div>
          <div
            class="decorate-view"
            v-if="item.title1 != void 0 && !res.notTitle"
          >
            <div class="decorate-view-title">小标题颜色</div>
            <div class="decorate-view">
              <ColorPicker v-model="item.color1" />
              <Input v-model="item.color1" />
            </div>
          </div>
          <div
            class="decorate-view"
            v-if="res.type === 'notice' && !res.notTitle"
          >
            <div class="decorate-view-title">公告内容</div>
            <div>
              <div
                v-for="(t, tindex) in item.title"
                :key="tindex"
                class="decorate-notice"
              >
                <Input v-model="t.context" style="width: 200px" />
                <Icon
                  @click="removeNotice(tindex)"
                  size="16"
                  type="md-close-circle"
                />
              </div>
            </div>
          </div>

          <!-- enter 链接 -->

          <div class="decorate-view" v-if="res.onlyImg">
            <div class="decorate-view-title">select模式</div>

            <div>
              <RadioGroup v-model="item.model" type="button">
                <Radio value="link" label="link">链接</Radio>
                <Radio value="hotzone" label="hotzone">热区</Radio>
              </RadioGroup>
            </div>
          </div>

          <div class="decorate-view" v-if="!res.notLink">
            <div class="decorate-view-title">select链接</div>
            <div
              v-if="item.url && item.url.length != 0"
              class="decorate-view-link"
            >
              已选链接：

              <span>
                {{
                  ways.find((e) => {
                    return item.url.___type == e.name;
                  })
                    ? ways.find((e) => {
                        return item.url.___type == e.name;
                      }).title
                    : "发现"
                }}
                -
                <!-- 当select完链接之后的专题名称 -->
                <span v-if="item.url.pageType == 'special'">
                  {{ item.url.name }}</span
                >
                <!-- 当select完链接之后的goods name -->
                <span v-if="item.url.___type == 'goods'">
                  {{ item.url.goodsName }}</span
                >
                <!-- 当select完链接之后的分类回调 -->
                <span v-if="item.url.___type == 'category'">
                  {{ item.url.name }}</span
                >
                <!-- 当select完链接之后的店铺回调 -->
                <span v-if="item.url.___type == 'shops'">
                  {{ item.url.memberName }}</span
                >
                <!-- 当select完链接之后的Others回调 -->
                <span v-if="item.url.___type == 'other'">
                  {{ item.url.title }}</span
                >

                <!-- 当select完活动之后的Others回调 -->
                <span v-if="item.url.___type == 'marketing'">
                  <span v-if="item.url.___promotion == 'SECKILL'"> 秒杀 </span>
                  <span v-if="item.url.___promotion == 'FULL_DISCOUNT'">
                    full减
                  </span>
                  <span v-if="item.url.___promotion == 'PINTUAN'"> 拼团 </span>
                  {{ item.url.title || item.url.goodsName }}
                </span>
                <!-- 当select完活动之后的Others回调 -->
                <span v-if="item.url.___type == 'pages'">
                  {{ item.url.title }}</span
                >
              </span>
            </div>
            <div>
              <Button
                ghost
                size="small"
                type="primary"
                @click="clickLink(item, index, res)"
              >
                {{ item.model === "hotzone" ? "绘制热区" : "select链接" }}</Button
              >
            </div>
          </div>
          <!-- 链接address-->
          <div
            class="decorate-view"
            v-if="
              item.url &&
              item.url.url !== undefined &&
              item.url.___type == 'other'
            "
          >
            <div class="decorate-view-title">外部链接</div>
            <div>
              <Input v-model="item.url.url" style="width: 200px" />
            </div>
          </div>

          <p
            v-if="
              item.url &&
              item.url.url !== undefined &&
              item.url.___type == 'other'
            "
          >
            (如非同域名下，则在小程序与公众号中无效)
          </p>
        </div>
      </div>
    </div>

    <Button
      v-if="
        res.type != 'tpl_ad_list' &&
        res.type != 'tpl_activity_list' &&
        !res.notAdd &&
        res.direction != 'horizontal'
      "
      type="primary"
      @click="addDecorate(res.type, res)"
      ghost
      >添加</Button
    >

    <liliDialog
      ref="liliDialog"
      @selectedLink="selectedLink"
      @selectedGoodsData="selectedGoodsData"
    ></liliDialog>

    <Modal width="800px" title="select分类" v-model="enableSelectCategory">
      <categoryTemplate
        v-if="enableSelectCategory"
        @selected="confirmCategory"
      />
    </Modal>

    <hotzone ref="hotzone" @changeZone="changeZone"></hotzone>

    <Modal width="1200px" v-model="picModelFlag">
      <ossManage @callback="callbackSelected" ref="ossManage" />
    </Modal>
  </div>
</template>
<script>
import ossManage from "@/views/sys/oss-manage/ossManage";
import { modelData } from "./config";
import hotzone from "@/components/hotzone";
import ways from "@/components/lili-dialog/wap.js"; // select链接的类型
import categoryTemplate from "@/components/lili-dialog/template/category"; // select链接的类型
export default {
  components: {
    ossManage,
    hotzone,
    categoryTemplate,
  },
  data() {
    return {
      ways, // select链接的类型
      picModelFlag: false, //图片select器
      linkType: "goods", // dialog弹窗口类型
      styleFlag: false, //广告魔方开关
      textAlign: this.res.options.list[0]
        ? this.res.options.list[0].textAlign
        : "center", //文字对齐方式
      promotionsFlag: false, //广告魔方开关
      selectedLinkIndex: "", //select链接的索引
      modelData, // 装修数据
      selectedGoods: "", // 已选Goods
      selectedLinks: "", // 已选链接
      modelList: "", // 装修列表
      enableSelectCategory: false, //Goods是否绑定分类
      goodsSelectedIndex: 0, //绑定Goods Category的索引
    };
  },
  watch: {
    res: {
      handler: (val) => {},
      deep: true,
    },
  },
  props: ["res"],
  methods: {
    // select分类
    confirmCategory(val) {
      let data = {
        ...this.res.options.list[0].titleWay[this.goodsSelectedIndex],
      };
      let callback = {
        id: val[0].id,
        name: val[0].name,
        categoryIdWay: val[0].id,
      };
      data = {
        ...data,
        bindCategory: callback,
      };
      this.res.options.list[0].listWay =
        this.res.options.list[0].listWay.filter((item) => {
          return item.___index != this.goodsSelectedIndex;
        });
      this.res.options.list[0].titleWay[this.goodsSelectedIndex] = data;

      console.log(this.res.options.list[0]);
    },
    // Goods排序
    slotGoods(list, key, val) {
      const newVal = [];
      let newValIndex = 0;
      // 给当前点击goods分组
      list.forEach((item, index) => {
        if (item.___index == key) {
          newVal.push(item);
        }
      });
      // 获得当前点击Goods的索引
      newVal.forEach((item, index) => {
        if (item.id == val.id) {
          newValIndex = index;
        }
      });
      // 进行Goods排序
      this.upData(newVal, newValIndex);
      if (list.length == newVal.length) {
        list = newVal;
      } else {
        let newList;
        newVal.forEach((item, index) => {
          newList = list.filter((child) => {
            return child.id != item.id && child.___index != key;
          });
        });
        list = [...newList, ...newVal];
      }

      this.$set(this.res.options.list[0], "listWay", list);
    },

    // 轮播图排序
    slotBanner(val, key, index, down) {
      console.log(val);
      if (down == "down") {
        this.downData(val.options.list, index);
      } else {
        this.upData(val.options.list, index);
      }
    },
    upData(arr, index) {
      let newArr = [];
      if (arr.length > 1 && index !== 0) {
        newArr = this.swapItems(arr, index, index - 1);
      }
      return newArr;
    },
    swapItems(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    downData(arr, index) {
      let newArr = [];
      if (arr.length > 1 && index !== arr.length - 1) {
        newArr = this.swapItems(arr, index, index + 1);
      }
      return newArr;
    },
    // 改变横纵切换title内容
    changeDirection(val, data) {
      if (val == "horizontal") {
        const props = { ...data };
        data.title = [];
        data.title.push(props.title[0]);
      }
    },
    // select风格
    selectStyle() {
      this.styleFlag = !this.styleFlag;
    },
    selectPromotions() {
      this.promotionsFlag = !this.promotionsFlag;
    },
    // 回调select的链接
    selectedLink(val) {
      this.selectedLinks.zoneInfo = [];
      delete val.selected;
      delete val.intro;
      delete val.mobileIntro;
      this.selectedLinks.url = val;
    },
    // 回调goods信息
    selectedGoodsData(val) {
      if (!val) return false;
      let data = val.map((item) => {
        delete item.selected;
        delete item.intro;
        delete item.mobileIntro;
        return {
          img: item.thumbnail,
          title: item.goodsName,
          type: this.selectedGoods.title,
          ___index: this.selectedGoods.___index,
          ...item,
        };
      });
      this.res.options.list[0].listWay.push(...data);
      // 清除已经绑定的分类
      this.res.options.list[0].titleWay[this.goodsSelectedIndex].bindCategory =
        "";
      this.linkType = "";
    },
    // 绑定Goods
    bindGoodsId(val, index) {
      this.selectedGoods = val;
      this.goodsSelectedIndex = index;
      this.liliDialogFlag(true);
    },
    // 绑定分类
    bindGoodsCategory(index, key) {
      this.enableSelectCategory = true;
      this.goodsSelectedIndex = index;
    },
    // 点击抽屉
    clickDrawer(item, index) {
      this.$emit("handleDrawer", item);
      this.styleFlag = false;
    },
    // 打开图片select器
    liliDialogFlag(flag) {
      this.$refs.liliDialog.clearGoodsSelected();
      this.$refs.liliDialog.goodsFlag = flag;
      this.$refs.liliDialog.flag = true;
    },

    changeTextAlign(val) {
      this.res.options.list[0].textAlign = val;
      this.textAlign = val;
    },
    // 点击链接赋值一个唯一值，并将当前select的模块赋值
    clickLink(val, index, oval) {
      this.selectedLinks = val;
      if (val.model === "hotzone") {
        if (!val.zoneInfo) {
          val.zoneInfo = [];
        }
        this.$refs.hotzone.flag = true;
        this.$refs.hotzone.res = val;
      } else {
        this.liliDialogFlag(false);
      }
    },
    addZone(zoneInfo) {
      this.selectedLinks.zoneInfo.push(zoneInfo);
    },
    changeZone(zoneInfo) {
      this.selectedLinks.zoneInfo = zoneInfo;
    },
    //点击图片解析成base64
    changeFile(item, index) {
      const file = document.getElementById("files" + index).files[0];
      if (file == void 0) return false;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.$nextTick((res) => {
        reader.onload = (e) => {
          item.img = e.target.result;
        };
      });
    },
    //添加设置
    addDecorate(type, data) {
      if (type === "notice") {
        if (data.options.list[0].direction == "vertical") {
          this.res.options.list[0].title.push({
            content: "",
          });
        } else {
          this.$Message.error("仅纵向支持多添加");
        }
      } else {
        let way = {
          img: "https://picsum.photos/id/264/200/200",
          title: "标题",
          link: "",
          url: "",
          size: this.res.options.list[0] ? this.res.options.list[0].size : "",
          model: "link",
        };
        this.res.options.list.push(way);
      }
    },
    addHotPoint() {
      let way = {
        img: "https://picsum.photos/id/264/200/200",
        text: "标题",
        link: "",
        url: "",
      };
      this.res.options.list[0].points.push(way);
    },
    // 图片select器回显
    callbackSelected(val) {
      this.picModelFlag = false;
      this.selectedGoods.img = val.url;
    },
    // 点击select图片
    handleClickFile(item, index) {
      this.$refs.ossManage.selectImage = true;
      this.selectedGoods = item;
      this.picModelFlag = true;
    },
    removeNotice(index) {
      this.$nextTick(() => {
        this.res.options.list[0].title.splice(index, 1);
      });
    },
    // Close
    closeDecorate(index) {
      this.$nextTick(() => {
        this.res.options.list.splice(index, 1);
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "./decorate.scss";
</style>
