<template>
  <div id="course_detail" v-if="Object.keys(detail).length > 0">
    <ConfirmModal class="course-modal" v-if="couseIsFreeModal">
      <template slot="button_type">
        <BlueBtn
          @click.native="
            subscribe();
            couseIsFreeModal = false;
          "
          class="confirm"
        >
          <button slot="blue_btn">
            확인
          </button>
        </BlueBtn>
      </template>
    </ConfirmModal>
    <PurchaseApply
      v-if="toggleStore_purchase_apply"
      @goToOrder="
        detail.price.is_free
          ? coursePurchaseComplete()
          : $router.push({
              path: 'order',
              query: {
                type: 'session',
                cart_id: $route.query.id,
              },
            })
      "
      :lecture_info="detail"
    ></PurchaseApply>
    <GoToCart
      @goToCart="$router.push('cart')"
      v-if="toggleStore_cartModal"
    ></GoToCart>
    <img
      :src="detail.course_image"
      alt="파이썬 코딩 기본편"
      title="파이썬 코딩 기본편"
    />
    <div class="update_noti">
      <span
        >{{ detail.creation_date }}(업데이트 일자:{{
          detail.update_date
        }})</span
      >
    </div>
    <section class="section1">
      <div class="lecture_title">
        <h3 class="sub_title" v-html="detail.category"></h3>
        <h2 class="title" v-html="detail.title"></h2>
      </div>
      <div class="star_rating">
        <StarRating
          :rating="detail.ranking"
          :star-size="16"
          :read-only="true"
          :increment="0.01"
          :star-points="[
            23,
            2,
            14,
            17,
            0,
            19,
            10,
            34,
            7,
            50,
            23,
            43,
            38,
            50,
            36,
            34,
            46,
            19,
            31,
            17,
          ]"
        ></StarRating>
      </div>
      <h2 class="free" v-if="detail.price.is_free">무료</h2>
      <div class="price" v-else>
        <del
          class="original"
          v-if="detail.price.format_original != detail.price.format_final"
          >{{ detail.price.format_original }}</del
        >
        <span class="final">{{ detail.price.format_final }}원</span>
      </div>
      <div id="tag_wrap">
        <slot name="title_wrap">
          <div class="tag_list">
            <router-link
              class="tag"
              :to="{
                path: '/course',
                query: {
                  action: 'get_session_list',
                  pageCurrent: 1,
                  order: 'type_date',
                  keyword: '',
                  tag: list.tag.replace('#', ''),
                },
              }"
              v-for="(list, index) in detail.tags"
              :key="index"
            >
              {{ list.tag }}</router-link
            >
          </div>
        </slot>
      </div>
      <div id="subscribe">
        <div>
          <div class="subscribe_wrap">
            <BlueBtn
              v-if="
                is_subscribe || (is_subscribe == false && detail.is_teacher)
              "
            >
              <button
                ref="subs_btn"
                class="active_subscribe"
                slot="blue_btn"
                @click="goToPath()"
              >
                코스 보러가기
              </button>
            </BlueBtn>

            <BlueBtn v-else>
              <button ref="subs_btn" slot="blue_btn" @click="isPurchase()">
                구매하기
              </button>
            </BlueBtn>
          </div>
        </div>
        <div class="fixed_subs_btn" v-if="subscribe_btn">
          <button
            v-if="is_subscribe || (is_subscribe == false && detail.is_teacher)"
            class="active_subscribe"
            @click="goToPath()"
          >
            코스 보러가기
          </button>
          <!-- 무료코스인경우 -->
          <button
            class="free_course_btn"
            v-else-if="detail.price.is_free"
            @click="isPurchase()"
          >
            구매하기
          </button>
          <!-- 코스 구매를 안한경우 -->
          <div
            v-else-if="is_subscribe == false && detail.price.is_free == false"
          >
            <button class="add_btn" @click="cartAdd()">코스담기</button>
            <button
              class="share_btn"
              v-clipboard="url"
              v-clipboard:success="share"
              @click="share()"
            >
              공유하기
            </button>
            <button class="purchase_btn" @click="isPurchase()">
              구매하기
            </button>
          </div>
        </div>
      </div>
      <div class="add_share">
        <BlueBtn
          class="add"
          @click.native="cartAdd()"
          v-if="
            detail.price.is_free == false &&
              is_subscribe == false &&
              detail.is_teacher == false
          "
        >
          <button slot="blue_btn">
            코스담기
          </button>
        </BlueBtn>
        <BlueBtn
          class="share"
          :style="[
            detail.price.is_free == false &&
            is_subscribe == false &&
            detail.is_teacher == false
              ? { 'margin-left': '2%' }
              : { 'margin-left': 0, width: '100%' },
          ]"
        >
          <button slot="blue_btn" v-clipboard="url" v-clipboard:success="share">
            공유하기
          </button>
        </BlueBtn>
      </div>
    </section>
    <section class="section2">
      <div class="user_intro">
        <span class="total_lec"
          ><span class="color">{{ detail.course_list.length }}</span
          >개 클래스</span
        >
        <div
          class="ol_list"
          v-for="(list, index) in detail.course_list"
          :key="index"
        >
          <span v-html="list.title"></span>
          <div class="limit-date">
            <span>{{ list.limit }}</span>
          </div>
        </div>
      </div>
      <span class="name">{{ detail.teachers }}</span>
    </section>
    <section class="section3">
      <h2 class="title">코스개요</h2>
      <div class="description_contents" v-html="detail.description"></div>
    </section>
    <div class="course_info">
      <h2 class="course_list">
        <span>코스 별 강의 안내</span>
        <span class="all_lecture_num"
          >{{ detail.course_list.length }}개 클래스</span
        >
      </h2>
      <div
        class="ol_list"
        v-for="(list, index) in detail.course_list"
        :key="index"
      >
        <h2 class="title" v-if="index + 1 < 10">STEP 0{{ index + 1 }}.</h2>
        <h2 class="title" v-else>STEP {{ index + 1 }}.</h2>
        <CourseItem>
          <span class="lec_list" slot="router">
            <img :src="list.thumbnail" alt="이지업" title="이지업" />
          </span>
          <h4 slot="teacher">{{ list.teacher }}</h4>
          <h2 class="subtitle" slot="subtitle" v-html="list.title"></h2>
          <span slot="grade" class="score">{{ list.ranking }}</span>
          <h1 class="free" slot="free" v-if="list.is_free == 'Y'">
            FREE
          </h1>
        </CourseItem>
        <div class="btn_wrap">
          <BlueBtn v-if="list.chk_previous == 1">
            <button slot="blue_btn">
              선행과정 필수
            </button>
          </BlueBtn>
          <BlueBtn
            :class="[list.chk_previous == 0 ? 'confirm_btn' : 'right_btn']"
          >
            <router-link
              slot="blue_btn"
              tag="button"
              :to="{
                path: '/lecDetail',
                query: {
                  id: list.id,
                },
              }"
            >
              강의정보 확인
            </router-link>
          </BlueBtn>
        </div>
      </div>
      <div id="lec_eval">
        <h2>강의평가</h2>
        <div class="section_wrap">
          <!-- 강의평가 LEFT SECTION -->
          <div class="left_sec">
            <h3>{{ detail.ranking }}</h3>
            <StarRating
              :rating="detail.ranking"
              :star-size="17"
              :read-only="true"
              :increment="0.01"
              :star-points="[
                23,
                2,
                14,
                17,
                0,
                19,
                10,
                34,
                7,
                50,
                23,
                43,
                38,
                50,
                36,
                34,
                46,
                19,
                31,
                17,
              ]"
            ></StarRating>
            <button
              class="eval_btn"
              v-if="isPossibleReview && userStore_userinfo.access_token"
              @click="scoreModal()"
            >
              강의 평가
            </button>
          </div>
          <!-- 강의평가 RIGHT SECTION -->
          <div class="right_sec">
            <div
              class="line"
              v-for="(list, index) in score_info.score_list"
              :key="index"
            >
              <span class="left_star_wrap">
                <span class="left_star">
                  <img
                    src="@/assets/images/common/small_star.png"
                    alt=""
                    class="star"
                  />
                  <span class="star_count">{{ list.title }}</span>
                </span>
              </span>
              <ProgressBar
                :max="score_info.total"
                :value="list.count"
              ></ProgressBar>
            </div>
          </div>
        </div>
      </div>
      <CommentWrap
        :action="{
          action: 'get_session_review',
          session_id: $route.query.id,
        }"
        :isSubscribe="is_subscribe"
        @emitScoreCount="scoreCount"
      ></CommentWrap>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component } from "vue-property-decorator";
  import PurchaseApply from "@/components/modal/PurchaseApply.vue";
  import GoToCart from "@/components/modal/GotoCart.vue";
  import StarRating from "vue-star-rating";
  import BlueBtn from "@/components/common/BaseButton.vue";
  import CourseItem from "@/components/common/LectureItem.vue";
  import ProgressBar from "@/components/common/ProgressBar.vue";
  import CommentWrap from "@/components/lecture_detail/CommentWrap.vue";
  import Mixin from "@/views/mixins/lec_course_detail";
  import ConfirmModal from "@/components/common/ConfirmModal.vue";
  import { mapState } from "vuex";
  @Component({
    components: {
      ConfirmModal,
      GoToCart,
      ProgressBar,
      StarRating,
      CommentWrap,
      BlueBtn,
      CourseItem,
      PurchaseApply,
    },
    computed: {
      ...mapState("toggleStore", {
        toggleStore_cartModal: "cart_modal",
        toggleStore_score_info: "score_info",
        toggleStore_purchase_apply: "purchase_apply",
      }),
      ...mapState("userStore", {
        userStore_userinfo: "userinfo",
      }),
    },
  })
  export default class CourseDetail extends Mixin {
    private couseIsFreeModal = false;
    private userStore_userinfo!: { [key: string]: any };
    private coursePurchaseComplete(): void {
      this.couseIsFreeModal = true;
      this.$confirmMessage("코스 구매 신청이 완료되었습니다.");
    }
    private isPurchase(): void {
      this.$store.commit("toggleStore/Toggle", {
        purchase_apply: true,
      });
    }
    private goToPath(): void {
      this.$router.push({
        path: "/myClass/course",
        query: {
          keyword: "",
          pageCurrent: 1,
          order: "",
          view:
            this.$route.query.view === undefined
              ? this.userStore_userinfo.info.status == 1
                ? "teacher"
                : "student"
              : this.$route.query.view,
        },
      });
    }
    destroyed() {
      this.$store.commit("toggleStore/Toggle", {
        confirm_modal: false,
      });
    }
    created() {
      if (this.$cookies.get("user_info") != null) {
        this.isSubscribe();
      }
      this.getDetail("get_session_info");
    }
  }
</script>
<style scoped lang="scss">
  ::v-deep .course-modal {
    .btn_wrap {
      text-align: center;
    }
  }
  .update_noti {
    padding: 15px 4.445%;
    background: #f8f8f8;
    span {
      color: #999999;
      font-size: 14px;
    }
  }
  .section1 {
    padding: 4.445%;
    padding-bottom: 0;
    border-bottom: 4px solid #f8f8f8;
    .lecture_title {
      .sub_title {
        font-size: 14px;
        color: #999999;
      }
      .title {
        font-size: 18px;
        color: #333333;
      }
    }
    .star_rating {
      margin: 5px 0;
      ::v-deep .vue-star-rating {
        display: unset;
        .vue-star-rating-rating-text {
          font-size: 16px;
          color: #333333;
          margin-left: 4px;
          display: inline-block;
          vertical-align: 1.5px;
        }
      }
    }
    .price {
      span {
        font-weight: bold;
      }
      .original {
        font-size: 14px;
        color: #bdbdbd;
      }
      .final {
        margin-left: 5px;
        font-size: 18px;
        color: #114fff;
      }
    }
    #tag_wrap {
      .tag_list {
        margin-top: 5px;
        line-height: 35px;
        .tag {
          color: #a4a4a4;
          border: 2px solid #757575;
          border-radius: 20px;
          height: 24px;
          padding: 0 10px;
          display: inline-block;
          margin-right: 0.763%;
          font-size: 12px;
          text-align: center;
          line-height: 24px;
          font-family: unset;
        }
      }
    }
    #subscribe {
      .subscribe_wrap {
        .blue_btn {
          ::v-deep button {
            border-radius: 10px;
            margin: 10px 0;
            height: 40px;
            line-height: 32px;
            font-size: 18px;
          }
        }
        .active_subscribe {
          background-color: #ff114a;
          border-color: #ff114a;
        }
        .total_lec {
          font-size: 1.375rem;
          .color {
            color: #114fff;
          }
        }
        .name {
          font-size: 1.375rem;
          color: #666666;
        }

        .score {
          font-size: 1.375rem;
          color: #333333;
          vertical-align: middle;
          margin-left: 2%;
        }
      }
      .fixed_subs_btn {
        position: fixed;
        bottom: 0;
        background: #114fff;
        width: 100%;
        max-width: 720px;
        z-index: 2;
        left: 0;
        right: 0;
        margin: auto;
        .add_btn,
        .share_btn {
          white-space: nowrap;
          text-indent: 100%;
          overflow: hidden;
          height: 64px;
          width: 20%;
        }
        .purchase_btn {
          background: transparent;
          width: 60%;
          font-family: "NotoSansCJKkr-Medium";
          font-size: 20px;
          vertical-align: middle;
          color: #ffffff;
          text-align: center;
        }
        .add_btn {
          border-right: 1px solid #ccc;
          background: #333333
            url("~@/assets/images/lec_detail/fixed_lecture_add_ico.png")
            no-repeat center / 28px 27px;
        }
        .share_btn {
          background: #333333
            url("~@/assets/images/lec_detail/fixed_share_ico.png") no-repeat
            center / 28px 27px;
        }
        .active_subscribe {
          background-color: #ff114a;
          border-color: #ff114a;
          width: 100%;
          font-size: 20px;
          color: white;
          height: 64px;
        }
        .free_course_btn {
          width: 100%;
          display: block;
          height: 64px;
          line-height: 64px;
          background: transparent;
          font-family: "NotoSansCJKkr-Medium";
          font-size: 20px;
          color: #ffffff;
        }
      }
    }
  }
  .section2 {
    padding: 4.445%;
    border-bottom: 4px solid #f8f8f8;
    .user_intro {
      font-size: 14px;
      .total_lec {
        margin-bottom: 7px;
        display: block;
      }
      .ol_list {
        .limit-date {
          color: #999999;
        }
      }
    }
    .name {
      font-size: 14px;
    }
  }
  .section3 {
    padding: 4.445%;
    border-bottom: 4px solid #f8f8f8;
    .title {
      font-size: 18px;
      display: inline;
      background: linear-gradient(#ffffff 60%, rgba(94, 244, 255, 0.34) 40%);
    }
    .description_contents {
      margin-top: 10px;
      color: #666666;
      font-size: 14px;
      text-align: justify;
      font-family: "NotoSansCJKkr-Regular";
    }
  }
  .add_share {
    .blue_btn {
      display: inline-block;
      width: 49%;

      ::v-deep button {
        padding-left: 20px;
        background: white;
        border: 2px solid black;
        color: black;
        border-radius: 10px;
        margin: 10px 0;
        height: 40px;
        line-height: 32px;
        font-size: 18px;
      }
    }
    .add {
      ::v-deep button {
        background: url("~@/assets/images/lec_detail/lecture_add_ico.png")
          no-repeat 14px center / 28px 27px;
      }
    }
    .share {
      margin-left: 2%;
      ::v-deep button {
        background: url("~@/assets/images/lec_detail/share_ico.png") no-repeat
          no-repeat 14px center / 28px 27px;
      }
    }
  }
  .course_info {
    padding: 4.445%;
    .course_list {
      font-size: 18px;
      position: relative;
      .all_lecture_num {
        font-size: 14px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        height: 21px;
        margin: auto;
      }
    }
    .ol_list {
      // width: 48.782%;
      margin-top: 5%;
      .title {
        font-size: 18px;
      }
      ::v-deep .item {
        h4 {
          font-size: 14px;
          margin-top: 5px;
        }
        .subtitle {
          font-size: 16px;
        }
        .evaluate {
          .score {
            width: 7%;
          }
          .free {
            width: calc(100% - 7% - 12px);
          }
        }
      }
      .btn_wrap {
        margin-top: 5px;
        &:after {
          display: block;
          content: "";
          clear: both;
        }
        .blue_btn {
          width: 48%;
          float: left;
        }
        .right_btn {
          float: right;
          ::v-deep button {
            background: white;
            color: #114fff;
          }
        }
        .confirm_btn {
          width: 100%;
          ::v-deep button {
            background: white;
            color: #114fff;
          }
        }
      }
    }
  }
  #lec_eval {
    margin-top: 30px;
    padding: 0 4.445%;
    h2 {
      font-size: 18px;
    }
    .section_wrap {
      margin-top: 10px;
      .left_sec {
        width: 41%;
        text-align: center;
        vertical-align: middle;
        display: inline-block;
        h3 {
          font-size: 15px;
        }
        ::v-deep .vue-star-rating {
          margin: 5px 0;
          display: block;
          .vue-star-rating-rating-text {
            display: none;
          }
        }
        .eval_btn {
          background: #114fff;
          color: white;
          border-radius: 5px;
          font-size: 11px;
          padding: 3px 26.95%;
        }
      }
      .right_sec {
        width: 59%;
        display: inline-block;
        vertical-align: middle;
        span {
          display: inline-block;
          vertical-align: middle;
          img {
            vertical-align: middle;
            width: 50%;
          }
        }
        .line {
          &:not(:first-child) {
            margin-top: 1%;
          }
          .left_star_wrap {
            width: 15%;
            .left_star {
              width: 100%;
              .star {
                width: 10px;
                height: 10px;
              }
              .star_count {
                font-size: 12px;
                margin-left: 4px;
              }
            }
          }
          ::v-deep .progress_bar {
            height: 8px;
            position: relative;
            width: 85%;
            margin: 0;
          }
        }
      }
    }
  }
</style>
