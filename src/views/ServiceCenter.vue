<template>
  <div>
    <router-link
      :class="[
        {
          'router-link-active': $route.path.indexOf('/help/notice/read') >= 0,
        },
        'tab',
      ]"
      :to="{
        path: '/help/notice',
        query: {
          pageCurrent: 1,
          keyword: '',
        },
      }"
      ><span class="active_bar"></span>공지사항
    </router-link>
    <router-link
      class="tab"
      :to="{
        name: 'helpFaq',
        query: {
          category: 'all',
          current: 1,
          keyword: '',
        },
      }"
      ><span class="active_bar"></span>FAQ</router-link
    >
    <router-link class="tab" to="/help/qna"
      ><span class="active_bar"></span>1:1문의</router-link
    >
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  @Component
  export default class ServiceCenter extends Vue {
    active = 0;
  }
</script>
<style scoped lang="scss">
  .tab {
    font-size: 18px;
    font-weight: 600;
    width: 33.333%;
    display: inline-block;
    text-align: center;
    background: #f8f8f8;
    padding: 2% 0;
    position: relative;
    color: #999999;
    .active_bar {
      background: #f8f8f8;
      height: 4px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
    }
  }

  .router-link-active {
    color: black;
    background: #ffffff;
    .active_bar {
      background: #114fff;
    }
  }
</style>
