import { shallowMount, mount, createLocalVue } from "@vue/test-utils";
import SignUp from "@/views/SignUp.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import ApiUrl from "@/assets/js/api_url.js";
describe("회원가입", () => {
  let wrapper;
  beforeEach(() => {
    Vue.use(VueRouter);
    Vue.prototype.$axios = axios;
    Vue.prototype.$ApiUrl = ApiUrl;
    const router = new VueRouter({
      mode: "history",
      base: process.env.BASE_URL,
      duplicateNavigationPolicy: "ignore",
    });
    wrapper = shallowMount(SignUp, { router });
    // wrapper.setData({
    //   lastname: "염",
    //   firstname: "세중",
    //   email: "duatpwnd1@naver.com",
    //   pw1: 123,
    //   pw2: 123,
    //   agree: true,
    // });
  });
  describe("유효성 체크", () => {
    test("성을 입력 안했을경우", () => {
      const lastname = wrapper.vm.lastname;
      expect(lastname.trim().length).toBe(0);
    });
    test("이름을 입력 안했을경우", () => {
      const firstname = wrapper.vm.firstname;
      expect(firstname.trim().length).toBe(0);
    });
    test("이메일을 입력 안했을경우", () => {
      const email = wrapper.vm.email;
      expect(email.trim().length).toBe(0);
    });
    test("비밀번호를 입력 안했을경우", () => {
      const pw1 = wrapper.vm.pw1;
      expect(pw1.trim().length).toBe(0);
    });
    test("비밀번호확인을 입력 안했을경우", () => {
      const pw2 = wrapper.vm.pw2;
      expect(pw2.trim().length).toBe(0);
    });
    test("비밀번호가 서로 다를 경우", () => {
      wrapper.setData({ pw1: "pw111", pw2: "pw222" });
      expect(wrapper.vm.pw1 == wrapper.vm.pw2).toBeFalsy();
    });
    test("약관 내용에 동의 안했을경우", () => {
      wrapper.setData({ agree: false });
      expect(wrapper.vm.agree).toBeFalsy();
    });
  });
});