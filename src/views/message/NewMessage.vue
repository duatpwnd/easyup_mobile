<template>
  <div class="msg_send">
    <h2 class="title">메시지 발송</h2>
    <div class="row">
      <span class="left">받는 분</span>
      <input
        type="text"
        readonly
        class="readonly"
        v-if="$route.query.id"
        :value="view.send_name"
      />
      <div class="search_contents" v-else>
        <div class="inputcontainer">
          <input
            v-on:input="keyword = $event.target.value"
            class="search_input"
            placeholder="이메일 주소"
            @keyup="search()"
          />
          <div class="icon-container" v-show="loading">
            <i class="loader"></i>
          </div>
        </div>
        <!-- 선택된사람 -->
        <div class="selected_list" v-if="choice_list.length > 0">
          <span class="list" v-for="(list, index) in choice_list" :key="index">
            <span class="name">{{ list.text }}</span
            ><button class="close_btn" @click="close(list.id)">X</button>
          </span>
        </div>
      </div>
    </div>
    <ul class="received_list_wrap" v-if="received_list.length > 0">
      <li
        v-for="(list, index) in received_list"
        :key="index"
        :class="{ active: choice_list.indexOf(list) >= 0 }"
        @click="choice(list)"
      >
        {{ list.text }}
      </li>
    </ul>
    <p class="notice" v-if="keyword.length < 3 && keyword.length > 0">
      {{ 3 - keyword.length }}글자 이상 입력해주세요.
    </p>
    <p class="notice" v-if="search_result">
      결과가 없습니다.
    </p>
    <div class="row">
      <span class="left">제목</span>
      <input
        type="text"
        v-model="title"
        placeholder="30자 이내 작성해 주세요."
      />
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
      <label class="left">파일 첨부</label>
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.gif"
        id="upload"
        ref="upload"
        @change="fileSelect()"
      />
      <label for="upload" class="file">파일 선택</label>
      <span class="file_name">{{ file_obj.name }}</span>
    </div>
    <div class="row">
      <span class="left"></span>
      <button class="save_btn" @click="send()">발송</button>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  @Component({
    components: {},
  })
  export default class NewMsg extends Vue {
    $refs!: {
      textarea: HTMLTextAreaElement;
      upload: HTMLFormElement;
    };
    private view = ""; // 답장정보
    private loading = false; //검색찾는동안 로딩
    private choice_active = -1; //선택된사람 active 걸어주기
    private title = "";
    private choice_list: { [key: string]: any }[] = []; // 선택된사람
    private received_list: { [key: string]: any }[] = []; // 받는사람 찾기
    private keyword = ""; // 검색부분 v-model
    private file_obj = ""; // 파일객체
    private search_result = false;
    private editorData = ""; // 에디터 v-model
    private read(): void {
      const data = {
        action: "get_message_info",
        id: this.$route.query.id,
        type: "received",
      };
      this.$axios
        .post(this.$ApiUrl.mobileAPI_v1, JSON.stringify(data))
        .then((result: { [key: string]: any }) => {
          this.view = result.data.data.info;
          this.title = "답 : " + result.data.data.info.title;
          this.choice_list = [{ id: result.data.data.info.user_sender_id }];
          this.editorData =
            result.data.data.info.send_name +
            " : " +
            result.data.data.info.content;
        });
    }
    // 선택된사람 다시 빼기
    private close(id: number): void {
      const find_item: { [key: string]: any } = this.choice_list.find(
        (item) => {
          return item.id === id;
        }
      ) as object;
      const idx = this.choice_list.indexOf(find_item);
      const result = this.choice_list.splice(idx, 1);
    }
    // 선택된사람
    private choice(list: { [key: string]: any }): void {
      this.choice_list.push(list);
      this.choice_list = Array.from(new Set(this.choice_list));
    }
    private search(): void {
      this.search_result = false;
      this.received_list = [];
      const data = {
        action: "find_user",
        keyword: this.keyword,
      };
      if (this.keyword.length > 2) {
        this.loading = true;
        this.$axios
          .post(this.$ApiUrl.mobileAPI_v1, JSON.stringify(data), {
            headers: {
              Authorization: this.$cookies.get("user_info")
                ? "Bearer " + this.$cookies.get("user_info").access_token
                : null,
            },
          })
          .then((result: { [key: string]: any }) => {
            console.log(result);
            this.loading = false;
            if (result.data.data.items.length == 0) {
              this.search_result = true;
            } else {
              this.received_list = result.data.data.items;
            }
          });
      }
    }
    private send(): void {
      this.validationCheck().then((result) => {
        if (result == "success") {
          const formData = new FormData();
          const data = {
            action: "send_message",
            users: [] as number[],
            title: this.title,
            content: this.$refs.textarea.innerText.trim(),
            attach_1: this.file_obj,
          };
          const map = this.choice_list.map((el, index) => {
            return el.id;
          });
          data.users = map;
          // 배열값이 배열이 빠진 문자만 들어가는현상 발생
          for (let key in data) {
            formData.append(key, data[key as never]);
          }
          this.$axios
            .post(this.$ApiUrl.mobileAPI_v1, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: this.$cookies.get("user_info")
                  ? "Bearer " + this.$cookies.get("user_info").access_token
                  : null,
              },
            })
            .then((result: { [key: string]: any }) => {
              console.log(result);
              if (result.data.error != true) {
                if (result.data.data.fail == 0) {
                  this.$router.push({
                    path: "/msg/receivedList",
                    query: {
                      pageCurrent: 1,
                      keyword: "",
                      view: this.$route.query.view,
                    },
                  });
                }
              } else {
                this.$noticeMessage(result.data.message);
              }
            });
        }
      });
    }
    private fileSelect(): void {
      const selected_file = this.$refs.upload.files[0];
      this.file_obj = selected_file;
    }
    private validationCheck(): Promise<string> {
      return new Promise((resolve, reject) => {
        if (this.choice_list.length == 0) {
          this.$noticeMessage("받는분을 입력하세요");
        } else if (this.title.trim().length == 0) {
          this.$noticeMessage("제목을 입력하세요");
        } else {
          resolve("success");
        }
      });
    }
    created() {
      if (this.$route.query.id != undefined) {
        this.read();
      }
    }
  }
</script>
<style scoped lang="scss">
  .msg_send {
    padding: 4.445%;
    padding-bottom: 96px;

    .title {
      font-size: 2rem;
    }
    .notice {
      margin-left: 25.5%;
      margin-top: 2%;
      font-size: 1.5rem;
    }
    .received_list_wrap {
      margin-left: 25.5%;
      margin-top: 2%;
      background: #efefef;

      li {
        font-size: 1.5rem;
        padding: 2%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .active {
        background: #114fff;
        color: white;
      }
    }
    .row {
      display: table;
      width: 100%;
      margin-top: 10px;
      .readonly {
        border: 0;
        padding-left: 0;
      }
      .search_contents {
        width: 100%;
        margin-left: 0;
        line-height: unset;
        border: 1px solid #dbdbdb;
        border-radius: 5px;
        padding: 2.403% 4%;
        box-sizing: border-box;
        .inputcontainer {
          position: relative;
          width: 70%;
          .icon-container {
            position: absolute;
            right: 10px;
            top: 0;
            bottom: 0;
            margin: auto;
            height: 12px;
          }
          .loader {
            position: relative;
            height: 12px;
            width: 12px;
            display: inline-block;
            animation: around 5.4s infinite;
          }

          @keyframes around {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .loader::after,
          .loader::before {
            content: "";
            background: white;
            position: absolute;
            display: inline-block;
            width: 100%;
            height: 100%;
            border-width: 2px;
            border-color: #333 #333 transparent transparent;
            border-style: solid;
            border-radius: 20px;
            box-sizing: border-box;
            top: 0;
            left: 0;
            animation: around 0.7s ease-in-out infinite;
          }

          .loader::after {
            animation: around 0.7s ease-in-out 0.1s infinite;
            background: transparent;
          }
          .search_input {
            width: 80%;
            padding: 0;
            outline: none;
            &::placeholder {
              padding-left: 3px;
              font-size: 14px;
            }
          }
        }
        .selected_list {
          margin-top: 5px;
          .list {
            &:not(:first-child) {
              margin-top: 5px;
            }
            display: block;
            .name {
              background-color: #e4e4e4;
              border: 1px solid #aaa;
              font-size: 10px;
              padding: 5px;
              border-radius: 4px;
              vertical-align: middle;
              display: inline-block;
              width: 85%;
            }
            .close_btn {
              margin-left: 5px;
              vertical-align: middle;
            }
          }
        }
      }

      .multiple {
        height: 200px;
      }
      .left {
        font-size: 1.5rem;
        display: table-cell;
        width: 25.5%;
        vertical-align: middle;
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
      input[type="file"] {
        display: none;
      }
      .file {
        width: auto;
        color: #114fff;
        border: 1px solid #114fff;
        border-radius: 5px;
        font-size: 1.5rem;
        padding: 0.763% 5.946%;
      }
      .file_name {
        margin-left: 10px;
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
  }
</style>
