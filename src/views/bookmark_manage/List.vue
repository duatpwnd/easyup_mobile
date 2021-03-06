<template>
  <div v-if="bookmark_list">
    <div class="search_area">
      <Search>
        <select slot="option" class="select" v-model="order">
          <option value="">전체</option>
          <option value="course_name">강의명</option>
          <option value="section_name">섹션명</option>
          <option value="title">책갈피제목</option>
        </select>
        <input
          slot="slot_input"
          class="search_contents"
          placeholder="검색어를 입력하세요."
          :value="keyword"
          v-on:input="keyword = $event.target.value"
        />
        <button
          slot="search_btn"
          class="search_btn"
          @click="getList(1, order, keyword)"
        ></button>
      </Search>
    </div>

    <BoardTitle></BoardTitle>
    <p class="no_result" v-if="bookmark_list.list.length == 0">
      검색된 책갈피가 없습니다. 책갈피는 각 강의별 영상 화면에서 등록하실 수
      있습니다.
    </p>
    <div class="list" v-else>
      <BoardList v-for="(list, index) in bookmark_list.list" :key="index">
        <template slot="top">
          <span class="td left_td">{{ list.course_name }}</span>
          <span class="td right_td">{{ list.title }}</span>

          <img
            v-if="list.button_type == 'view'"
            src="@/assets/images/bookmark_manage/bookmark_read_btn.png"
            alt="책갈피 메모읽기"
            title="책갈피 메모읽기"
            class="bookmark_read_btn"
            @click="go_to_path('/bookmarkManage/read', list.id)"
          />
          <img
            v-else
            src="@/assets/images/bookmark_manage/bookmark_add_btn.png"
            alt="책갈피 메모생성"
            title="책갈피 메모생성"
            class="bookmark_add_btn"
            @click="go_to_path('/bookmarkManage/add', list.id)"
          />
        </template>
        <span class="td" slot="bottom">{{ list.created_at }}</span>
      </BoardList>
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
            bookmark_list.total_page != current && bookmark_list.total_page > 1
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
  import BoardTitle from "@/components/common/BoardTitle.vue";
  import BoardList from "@/components/common/BoardList.vue";
  import Pagination from "@/components/common/Pagination.vue";
  import { Vue, Component } from "vue-property-decorator";
  @Component({
    components: {
      Pagination,
      BoardTitle,
      BoardList,
      Search,
    },
  })
  export default class List extends Vue {
    private current = 1; //현재번호
    private order = "";
    private keyword = "";
    private bookmark_list = "";
    private go_to_path(url: string, id: number): void {
      this.$router
        .push({
          path: url,
          query: {
            id: id,
            view: this.$route.query.view,
          },
        })
        .catch(() => {});
    }
    private getList(num: number, order: string, keyword: string): void {
      const data = {
        action: "get_bookmark_list",
        current: num,
        search_status: order,
        keyword: keyword,
      };
      this.$axios
        .post(this.$ApiUrl.mobileAPI_v1, JSON.stringify(data))
        .then((result: { [key: string]: any }) => {
          if (result.data.error != true) {
            this.bookmark_list = result.data.data;
            this.$router
              .push({
                query: {
                  pageCurrent: num,
                  order: order,
                  keyword: keyword,
                  view: this.$route.query.view,
                },
              })
              .catch(() => {});
            this.order = order;
            this.keyword = keyword;
            this.current = num;
          }
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
  .no_result {
    text-align: center;
    font-size: 16px;
    padding: 15px;
  }
  .search_area {
    .search {
      margin-top: 0;
    }
  }
  .list {
    &:nth-child(even) {
      background: #f8f8f8;
    }

    .bookmark_add_btn {
      position: absolute;
      top: 0;
      right: 5px;
      width: 18.5px;
      height: 18px;
      bottom: 0;
      margin: auto;
    }
    .bookmark_read_btn {
      @extend .bookmark_add_btn;
      width: 15px;
      height: 16px;
    }
    .list_wrap {
      .left_td,
      .right_td {
        width: 50%;
      }
    }
  }
</style>
