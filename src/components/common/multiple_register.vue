<template>
  <div>
    <div class="row">
      <span class="left">강의 선택</span>
      <select class="select" name="" id="">
        <option value="">전체</option>
      </select>
    </div>
    <div class="row">
      <span class="left">과제명</span>
      <input type="text" placeholder="30자 이내 작성해 주세요." />
    </div>
    <div class="row">
      <span class="left contents">내용</span>
      <div
        contenteditable="true"
        v-html="editorData"
        class="textarea"
        ref="textarea"
      ></div>
    </div>
    <div class="row">
      <span class="left"></span>
      <button class="save_btn">저장</button>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  @Component
  export default class Register extends Vue {
    private editorData = ""; // 에디터 v-model
  }
</script>
<style scoped lang="scss">
  .title {
    font-size: 2rem;
  }
  .row {
    display: table;
    width: 100%;
    margin-top: 2%;
    .select {
      width: 100%;
      border-radius: 5px;
      border: 1px solid #dbdbdb;
      padding: 2.403% 4%;
      font-size: 1.5rem;
      background: url("~@/assets/images/lec_list/arrow_ico.png") no-repeat 90%
        center;
    }
    span {
      font-size: 1.5rem;
      display: table-cell;
      width: 25.5%;
    }
    .contents {
      vertical-align: top;
    }
    input,
    .textarea {
      width: 100%;
      font-size: 1.5rem;
      color: black;
      border: 1px solid #dbdbdb;
      border-radius: 5px;
      padding: 2.403% 4%;
      box-sizing: border-box;
      &::placeholder {
        color: #dbdbdb;
      }
    }
    .textarea {
      height: 300px;
      overflow: auto;
    }
    .save_btn {
      color: #ffffff;
      font-size: 1.75rem;
      background: #114fff;
      border-radius: 4px;
      width: 60%;
      padding: 1.5% 0;
      margin-top: 3%;
    }
  }
</style>
