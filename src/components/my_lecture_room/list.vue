<template>
  <div class="tr">
    <slot name="td1">
      <span class="td td1">비전공자는 어떻게 개발자가 되</span>
    </slot>
    <slot name="right">
      <span class="td td2">12명</span>
    </slot>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  @Component
  export default class List extends Vue {}
</script>
<style scoped lang="scss">
  .tr {
    width: 100%;
    margin-top: 3px;
    .td {
      display: inline-block;
      font-size: 14px;
      color: #666666;
      vertical-align: middle;
    }
    .td1 {
      width: 60%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .td2 {
      font-weight: bold;
      width: 40%;
      text-align: right;
      color: #333333;
    }

    .date {
      color: black;
      font-weight: bold;
    }
  }
</style>
