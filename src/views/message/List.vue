<template>
  <div>
    <span
      class="tab"
      v-for="(tab, index) in types"
      :class="{ active: index == isActive }"
      :key="index"
      @click="toggle(tab.target, index)"
      ><span class="active_bar"></span>{{ tab.name }}</span
    >
    <keep-alive>
      <component v-bind:is="type"></component>
    </keep-alive>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import Tab1 from "@/components/message/Tab1.vue";
  import Tab2 from "@/components/message/Tab2.vue";
  @Component({
    components: {
      Tab1,
      Tab2,
    },
  })
  export default class List extends Vue {
    private isActive = 0;
    private type = "Tab1";
    private types = [
      { name: "수신", target: "Tab1" },
      { name: "발신", target: "Tab2" },
    ];
    private toggle(type: string, index: number): void {
      this.type = type;
      this.isActive = index;
    }
  }
</script>
<style scoped lang="scss">
  .tab {
    font-size: 2rem;
    font-weight: 600;
    width: 50%;
    display: inline-block;
    text-align: center;
    background: #f8f8f8;
    padding: 2% 0;
    position: relative;
  }
  .active_bar {
    background: #f8f8f8;
    padding: 1.118%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
  }
  .active {
    background: #ffffff;
    .active_bar {
      background: #114fff;
    }
  }
</style>
