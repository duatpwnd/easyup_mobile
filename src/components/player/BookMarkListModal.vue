<template>
  <div class="bookmark-list">
    <span class="list_title">책갈피</span
    ><span class="list_close_btn" @click="close()">창닫기</span>
    <ul class="bookmark-ul list-unstyled">
      <li
        class="clearfix"
        v-for="(li, index) in list"
        :key="index"
        @click="goToPlayer(li.iid, li.check_point)"
      >
        <span class="title pull-left">{{ li.title }}</span
        ><span class="time pull-left">{{ li.check_point }}</span
        ><span class="delete pull-right" @click.stop="bookmark_remove(li.id)">
          <font-awesome-icon :icon="['fa', 'times']" />
        </span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
  import { mapState } from "vuex";
  import { Vue, Component } from "vue-property-decorator";
  @Component({
    computed: {
      ...mapState("toggleStore", {
        toggleStore_bookmark_list_info: "bookmark_list_info",
      }),
      ...mapState("playerStore", {
        playerStore_video: "video_stop_time",
        playerStore_custom_type: "custom_type",
        playerStore_lp_type: "lp_type",
      }),
    },
  })
  export default class BookmarkListModal extends Vue {
    list: object[] = [{}];
    toggleStore_bookmark_list_info!: { [key: string]: any };
    goToPlayer(id: number, check_point: number): void {
      const check = this.$hms_to_s(check_point);
      this.$store.commit("playerStore/playerState", {
        check_time: check == 0 ? 1 : check,
      });
      this.$emit("bookmark_move", id, "bookmark");
      this.close();
    }
    close(): void {
      this.$store.commit("toggleStore/bookmarkListToggle", {
        bookmark_list_modal: false,
        current_id: "",
      });
    }
    bookmark_remove(id: number): void {
      const data = {
        action: "delete_bookmark",
        id: id,
      };
      this.$axios
        .post(this.$ApiUrl.mobileAPI_v1, JSON.stringify(data))
        .then((result: { [key: string]: any }) => {
          this.getList();
        });
    }
    getList(): void {
      const data = {
        action: "get_player_bookmark",
        current_id: this.toggleStore_bookmark_list_info.current_id,
      };
      this.$axios
        .post(this.$ApiUrl.mobileAPI_v1, JSON.stringify(data))
        .then((result: { [key: string]: any }) => {
          this.list = result.data.data;
          this.list.sort(
            (a: { [key: string]: any }, b: { [key: string]: any }) => {
              return a.check_point - b.check_point;
            }
          );
          this.list.map((el: { [key: string]: any }) => {
            el.check_point = this.$getTimeStringSeconds(el.check_point);
          });
        });
    }
    created() {
      this.getList();
    }
  }
</script>
<style scoped lang="scss">
  .bookmark-list {
    max-width: 720px;
    width: 70%;
    padding: 10px 20px;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 5px;
    background: #ffffff;
    position: fixed;
    z-index: 1;
    height: 360px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .list_title {
      font-size: 18px;
      margin-bottom: 15px;
      display: inline-block;
    }
    .list_close_btn {
      color: #999999;
      cursor: pointer;
      float: right;
      font-size: 18px;
    }
    .bookmark-ul {
      max-height: 288px;
      overflow: auto;
      padding-right: 10px;

      .clearfix {
        font-size: 18px;
        &:after {
          display: block;
          content: "";
          clear: both;
        }
        .pull-left {
          float: left;
          width: 60%;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .time {
          width: 34%;
          text-align: right;
        }
        .pull-right {
          text-align: right;
          float: right;
          width: 3%;
          .fa-times {
            color: #e0e0e0;
          }
        }
      }
    }
  }
</style>
