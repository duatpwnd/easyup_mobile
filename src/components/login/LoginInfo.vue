<template>
  <div class="menu_modal">
    <div class="profile">
      <span class="profile_ico">
        <img
          :src="userStore_userinfo.info.profile_image"
          alt="프로필"
          title="프로필"
        />
      </span>
      <h2>{{ userStore_userinfo.info.username }}</h2>
      <h3>{{ userStore_userinfo.info.email }}</h3>
    </div>

    <div class="lnb_menu">
      <button class="lnb arrow" @click="goToLecture()">강의</button>
      <button
        class="lnb arrow"
        @click="
          $router
            .push({
              path: '/course',
              query: {
                action: 'get_session_list',
                pageCurrent: 1,
                order: 'type_date',
                keyword: '',
              },
            })
            .catch(() => {});
          $store.commit('toggleStore/Toggle', {
            login_modal: false,
            mask: false,
          });
        "
      >
        코스
      </button>
      <button
        class="lnb"
        @click="
          $router
            .push({
              path: '/techBlog',
              query: {
                pageCurrent: 1,
                keyword: '',
              },
            })
            .catch(() => {});
          $store.commit('toggleStore/Toggle', {
            login_modal: false,
            mask: false,
          });
        "
      >
        이지채널
      </button>
      <button
        @click="
          $router
            .push({
              path: '/studentClassRoom',
              query: {
                view:
                  $route.query.view === undefined
                    ? userStore_userinfo.info.status == 1
                      ? 'teacher'
                      : 'student'
                    : $route.query.view,
              },
            })
            .catch(() => {});
          $store.commit('toggleStore/Toggle', {
            login_modal: false,
            mask: false,
          });
        "
        class="lnb arrow"
        tag="button"
      >
        내강의실
      </button>
      <button
        v-if="userStore_userinfo.info.is_unijob_possible"
        @click="
          $router
            .push({
              path: '/uniJob',
              query: {
                pageCurrent: 1,
                keyword: '',
              },
            })
            .catch(() => {});
          $store.commit('toggleStore/Toggle', {
            login_modal: false,
            mask: false,
          });
        "
        class="lnb"
      >
        이지잡
      </button>
      <button
        class="lnb"
        @click="
          $router
            .push({
              path: '/profileModify',
              query: {
                view:
                  $route.query.view === undefined
                    ? userStore_userinfo.info.status == 1
                      ? 'teacher'
                      : 'student'
                    : $route.query.view,
              },
            })
            .catch(() => {});
          $store.commit('toggleStore/Toggle', {
            login_modal: false,
            mask: false,
          });
        "
      >
        개인정보 확인/수정
      </button>
    </div>
    <div class="support">
      <button
        @click="
          $router
            .push({
              path: '/help/notice',
              query: {
                pageCurrent: 1,
                keyword: '',
              },
            })
            .catch(() => {});
          $store.commit('toggleStore/Toggle', {
            login_modal: false,
            mask: false,
          });
        "
      >
        공지사항
      </button>
      <button
        class="faq_btn"
        @click="
          $router
            .push({
              name: 'helpFaq',
              query: {
                category: 'all',
                current: 1,
                keyword: '',
              },
            })
            .catch(() => {});
          $store.commit('toggleStore/Toggle', {
            login_modal: false,
            mask: false,
          });
        "
      >
        FAQ
      </button>
      <button
        @click="
          $router.push('/help/qna').catch(() => {});
          $store.commit('toggleStore/Toggle', {
            login_modal: false,
            mask: false,
          });
        "
      >
        1:1문의
      </button>
    </div>
    <div class="logout">
      <BlueBtn>
        <button slot="blue_btn" @click="logout()">
          로그아웃
        </button>
      </BlueBtn>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import BlueBtn from "@/components/common/BaseButton.vue";
  import { mapState } from "vuex";
  @Component({
    components: {
      BlueBtn,
    },
    computed: {
      ...mapState("userStore", {
        userStore_userinfo: "userinfo",
      }),
    },
  })
  export default class LoginInfo extends Vue {
    private userid = "";
    private userpw = "";
    private logout(): void {
      this.$logOut();
    }
    private goToPath(url: string, obj: object): void {
      this.$router.push(url).catch(() => {});
      this.$store.commit("toggleStore/Toggle", obj);
    }
    private goToLecture(): void {
      this.$EventBus.$emit("GoToLecture", true);
    }
  }
</script>
<style scoped lang="scss">
  .blue_btn {
    ::v-deep button {
      font-size: 1.5rem;
      height: 40px;
      line-height: 32px;
    }
  }
  .menu_modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    width: 72.222%;
    max-width: 720px;
    box-sizing: border-box;
    background: white;
    height: 100%;

    .profile {
      padding: 4.445%;
      text-align: center;
      .profile_ico {
        width: 33.773%;
        display: inline-block;
        border-radius: 100%;
        overflow: hidden;
      }
      h2 {
        margin-top: 6%;
        font-size: 2rem;
      }
      h3 {
        font-size: 1.25rem;
        color: #999999;
      }
    }
    .lnb_menu {
      border-top: 4px solid #f8f8f8;
      border-bottom: 4px solid #f8f8f8;
      padding: 4.445%;
      border-top: 4px solid #f8f8f8;
      border-bottom: 4px solid #f8f8f8;
      .lnb {
        text-align: left;
        width: 100%;
        margin-top: 4%;
        font-size: 1.5rem;
        font-family: "NotoSansCJKkr-Regular";
      }
      .arrow {
        background: url("~@/assets/images/common/right_arrow.png") no-repeat
          right center / 3%;
      }
    }
    .support {
      padding-bottom: 0;
      padding: 4.445%;
      button {
        width: 100%;
        text-align: left;
        font-size: 1.5rem;
        display: block;
      }
      .faq_btn {
        margin: 4% 0;
      }
    }
    .logout {
      background: white;
      padding: 4.445%;
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
    }
  }
</style>
