import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
@Module({ namespaced: true, name: "PlayStore" })
export default class PlayStore extends VuexModule {
  check_time = ""; // 즐겨찾기 추가 시간
  stop_time = ""; // 유튜브 스탑 함수
  video_stop_time = ""; // video.js 객체
  current_item_id = ""; // 현재 아이템 아이디
  current_index = ""; // 현재인덱스번호
  current_link = ""; // 현재 링크
  list = "";
  custom_type = ""; //커스텀 타입
  lp_type = ""; //영상인지 링크인지
  nextBtn = true; // 다음강좌 버튼
  nextItem = ""; // 다음강의아이디
  isBookmarkLink = true;
  get getCurrentLink() {
    return this.current_link.split("?")[0];
  }
  @Mutation
  playerState(param) {
    Object.keys(param).forEach((el, index) => {
      this[el] = Object.values(param)[index];
    });
  }
}
