<template>
  <div v-if="Object.keys(info).length > 0">
    <div class="head">
      <span class="title">[{{ info.course_name }}]</span>
      <span v-html="info.section_name"></span> <span v-html="info.title"></span>
    </div>
    <div class="contents_wrap">
      <BlueBtn>
        <template slot="blue_btn">
          <button
            @click="
              $store.commit('playerStore/playerState', {
                check_time:
                  $hms_to_s(info.check_point) == 0
                    ? 1
                    : $hms_to_s(info.check_point),
              });
              $router.push({
                path: '/play',
                query: {
                  course_id: info.c_id,
                  lp_id: info.lp_id,
                  iid: info.iid,
                  linkType: 'bookmark',
                },
              });
            "
            slot="blue_btn"
          >
            타임라인 {{ info.check_point }}
          </button>
          <span class="date">{{ info.created_at }}</span>
        </template>
      </BlueBtn>
      <div class="contents" v-html="info.contents"></div>
    </div>
    <div class="button_wrap">
      <BlueBtn class="btn">
        <button
          slot="blue_btn"
          @click="go_to_path('/bookmarkManage/add', info.id)"
        >
          수정
        </button>
      </BlueBtn>
      <BlueBtn class="btn last_btn">
        <button slot="blue_btn" @click="deleteBookmark()">
          삭제
        </button>
      </BlueBtn>
    </div>
  </div>
</template>
<script lang="ts">
  import BlueBtn from "@/components/common/BaseButton.vue";
  import { Vue, Component } from "vue-property-decorator";
  @Component({
    components: {
      BlueBtn,
    },
  })
  export default class Read extends Vue {
    private info: { [key: string]: any } = {};
    private go_to_path(url: string, id: number): void {
      this.$router
        .push({
          path: url,
          query: {
            id: id,
            mode: "modify",
            view: this.$route.query.view,
          },
        })
        .catch(() => {});
    }
    private deleteBookmark(): void {
      const data = {
        action: "delete_bookmark",
        id: this.$route.query.id, //게시물ID
      };
      console.log(data);
      this.$axios
        .post(this.$ApiUrl.mobileAPI_v1, JSON.stringify(data))
        .then((result: { [key: string]: any }) => {
          console.log(result);
          if (result.data.data.result == 1) {
            this.$router.push({
              path: "/bookmarkManage",
              query: {
                keyword: "",
                pageCurrent: 1,
                order: "course_name",
                view: this.$route.query.view,
              },
            });
          }
        });
    }
    private bookmarkRead(): void {
      const data = {
        action: "get_bookmark_info",
        id: this.$route.query.id, //게시물ID
      };
      console.log(data);
      this.$axios
        .post(this.$ApiUrl.mobileAPI_v1, JSON.stringify(data))
        .then((result: { [key: string]: any }) => {
          console.log(result.data);
          this.info = result.data.data.info;
          this.info.check_point = this.$getTimeStringSeconds(
            this.info.check_point
          );
        });
    }
    created() {
      this.bookmarkRead();
    }
  }
</script>
<style scoped lang="scss">
  .head {
    margin-top: 5%;
    span {
      font-size: 1.375rem;
    }
    .title {
      color: #114fff;
      margin-right: 2%;
      font-weight: 600;
    }
  }
  .contents_wrap {
    border-top: 2px solid #333333;
    border-bottom: 2px solid #333333;
    margin: 2% 0;
    padding: 2% 0;
    .blue_btn {
      position: relative;
      button {
        width: 40%;
        font-size: 12px;
        height: 22px;
        line-height: 20px;
        padding: 0;
      }
      .date {
        position: absolute;
        top: 0;
        right: 0;
        height: 14.5px;
        bottom: 0;
        margin: auto;
        font-size: 12px;
        color: #666666;
      }
    }
    .contents {
      white-space: pre-wrap;
      font-size: 1.25rem;
      color: #666666;
      font-family: "NotoSansCJKkr-Regular";
      margin-top: 10px;
      word-break: break-all;
    }
  }
  .button_wrap {
    &:after {
      display: block;
      content: "";
      clear: both;
    }
    .btn {
      float: left;
      width: 23.172%;
      button {
        border: 1px solid #114fff;
        background: white;
        color: #114fff;
        height: 24px;
        line-height: 16px;
        font-size: 12px;
      }
      &:not(:first-child) {
        margin-left: 2%;
      }
    }
    .last_btn {
      float: right;
    }
  }
</style>
