<template>
  <section>
    <h2>공지사항</h2>
    <div class="table">
      <span class="td td1">비전공자는 어떻게 개발자가 되는가</span>
      <span class="td td2">2020.06.20</span>
    </div>
    <div class="table">
      <span class="td td1">비전공자는 어떻게 개발자가 되는가</span>
      <span class="td td2">2020.06.20</span>
    </div>
    <div class="table">
      <span class="td td1">비전공자는 어떻게 개발자가 되는가</span>
      <span class="td td2">2020.06.20</span>
    </div>
    <div class="table">
      <span class="td td1">비전공자는 어떻게 개발자가 되는가</span>
      <span class="td td2">2020.06.20</span>
    </div>
  </section>
</template>
<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  @Component
  export default class Notice extends Vue {}
</script>
<style scoped lang="scss">
  section {
    padding: 4.445%;
    h2 {
      font-size: 2rem;
    }
    .table {
      display: table;
      width: 100%;
      margin-top: 1%;
      .td {
        display: table-cell;
        font-size: 1.5rem;
        color: #666666;
      }
      .td1 {
        width: 70%;
      }
      .td2 {
        width: 30%;
        font-weight: bold;
        text-align: right;
        color: #333333;
      }
    }
  }
</style>
