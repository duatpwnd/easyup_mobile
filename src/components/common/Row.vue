<template>
  <div class="li">
    <slot name="row"></slot>
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {};
    },
    methods: {},
  };
</script>
<style scoped lang="scss">
  .li {
    .title {
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 67%;
    }
    .row {
      white-space: pre-wrap;
      &::after {
        display: block;
        content: "";
        clear: both;
      }

      ::v-deep .blue_btn {
        float: right;
        width: 30%;
        height: 30px;
        .btn_id {
          font-size: 16px;
          height: 30px;
          line-height: 21px;
        }
      }
      .dt,
      .dd,
      .status {
        font-size: 14px;
      }
      .date {
        white-space: pre-line;
        font-size: 16px;
        float: left;
      }
      .dt {
        float: left;
      }
      .dd {
        float: right;
      }
      .status {
        color: #114fff;
      }
      .lec,
      .course {
        color: #999999;
        margin-right: 10px;
      }
    }
    .contain_btn {
      line-height: 30px;
    }
  }
</style>
