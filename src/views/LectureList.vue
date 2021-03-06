<template>
  <div id="lec_list">
    <div class="breadcrumb">
      <span v-if="$route.query.title || $route.query.tag"
        >{{ $route.meta.title }} > {{ $route.query.title
        }}{{ $route.query.tag }}</span
      >
      <span v-else>{{ $route.meta.title }} > 전체</span>
    </div>
    <Search>
      <select
        slot="option"
        class="select"
        v-model="order"
        @change="getList(1, order, keyword)"
      >
        <option value="type_date">최신 등록순</option>
        <option value="type_name">이름순</option>
        <option value="type_rating">평점순</option>
      </select>
      <input
        slot="slot_input"
        class="search_contents"
        placeholder="강의명을 검색하세요."
        :value="keyword"
        v-on:input="keyword = $event.target.value"
      />
      <button
        slot="search_btn"
        class="search_btn"
        @click="getList(1, 'type_date', keyword)"
      ></button>
    </Search>
    <h2 class="total">
      전체 검색 총<span class="count">{{ category_list.total_count }}</span
      >건
    </h2>
    <div class="lec_list_wrap">
      <div
        class="li"
        v-for="(list, index) in category_list.list"
        :key="index"
        :style="[{ 'margin-top': index > 1 ? '24px' : 0 }]"
        @click="
          $router.push({
            path: $route.name == 'course' ? '/courseDetail' : '/lecDetail',
            query: {
              id: list.id,
            },
          })
        "
      >
        <LecItem>
          <span class="lec_list" slot="router">
            <img :src="list.thumbnail" :alt="list.title" :title="list.title" />
          </span>
          <h4 slot="teacher">{{ list.teacher }}</h4>
          <h2 class="subtitle" slot="subtitle" v-html="list.title"></h2>
          <span slot="grade" class="score">{{ list.rating }}</span>
          <h1 class="free" slot="free" v-if="list.price.is_free">
            FREE
          </h1>
          <span class="price" v-else slot="free">
            <del
              class="original"
              v-if="list.price.format_original != list.price.format_final"
              >{{ list.price.format_original }}</del
            >
            <span class="final">{{ list.price.format_final }}</span>
          </span>
        </LecItem>
      </div>
    </div>
    <Pagination>
      <template slot="paging">
        <li
          class="prev"
          @click="getList(Number(current) - 1, order, $route.query.keyword)"
          v-if="current > 1"
        >
          이전페이지
        </li>
        <li
          class="next"
          v-if="
            category_list.total_page != current && category_list.total_page > 1
          "
          @click="getList(Number(current) + 1, order, $route.query.keyword)"
        >
          다음페이지
        </li>
      </template>
    </Pagination>
  </div>
</template>
<script lang="ts">
  import Search from "@/components/common/Search.vue";
  import LecItem from "@/components/common/LectureItem.vue";
  import Pagination from "@/components/common/Pagination.vue";
  import { Vue, Watch, Component } from "vue-property-decorator";
  @Component({
    components: {
      Pagination,
      LecItem,
      Search,
    },
  })
  export default class LectureList extends Vue {
    current = 1; //현재번호
    order = "";
    keyword = "";
    category_list = "";
    @Watch("$route")
    onPropertyChanged(
      to: { [key: string]: any },
      from: { [key: string]: any }
    ): void {
      if (to.query.category_code != from.query.category_code) {
        this.getList(
          this.$route.query.pageCurrent,
          this.$route.query.order,
          this.$route.query.keyword
        );
      }
    }
    getList(num: number, order: string, keyword: string): void {
      const data = {
        action: this.$route.query.action,
        current: num,
        order: order,
        keyword: keyword,
        category_code: this.$route.query.category_code
          ? this.$route.query.category_code
          : null,
        tag: this.$route.query.tag,
      };
      this.order = order;
      this.keyword = keyword;
      this.current = num;
      this.$axios
        .post(this.$ApiUrl.mobileAPI_v1, JSON.stringify(data))
        .then((result: { [key: string]: any }) => {
          console.log(result);
          this.category_list = result.data.data;
          this.$router
            .push({
              query: {
                action: this.$route.query.action,
                pageCurrent: num,
                order: order,
                keyword: keyword,
                category_code: this.$route.query.category_code,
                tag: this.$route.query.tag,
              },
            })
            .catch(() => {});
        });
    }
    created() {
      this.getList(
        this.$route.query.pageCurrent,
        this.$route.query.order,
        this.$route.query.keyword
      );
    }
  }
</script>
<style scoped lang="scss">
  #lec_list {
    padding: 4.445%;
    padding-bottom: 8.89%;
    .breadcrumb {
      background: #f8f8f8;
      height: 26px;
      font-size: 14px;
      line-height: 20px;
      padding: 3px 10px;
      box-sizing: border-box;
      color: #999999;
    }
    .total {
      display: inline-block;
      font-size: 13px;
      margin-top: 11px;
      .count {
        display: inline-block;
        color: #114fff;
      }
    }
    .lec_list_wrap {
      margin-top: 24px;
      &:after {
        display: block;
        clear: both;
        content: "";
      }
      .li {
        float: left;
        width: 48.782%;
        &:nth-child(odd) {
          margin-right: 2.436%;
        }
        ::v-deep .item {
          h4 {
            font-size: 12px;
          }
          .subtitle {
            font-size: 14px;
          }
          .evaluate {
            margin-top: 3px;
          }
        }
      }
    }
    .paging {
      margin-top: 30px;
      &:after {
        display: block;
        clear: both;
        content: "";
      }
      li {
        border: 1px solid #dbdbdb;
        color: #363636;
        padding: 9px;
        border-radius: 4px;
      }
      .prev {
        float: left;
      }
      .next {
        float: right;
      }
    }
  }
</style>
