<script setup>
import formInput from './components/formInput.vue'
import { ref } from 'vue'
const form = ref({
  age: null,
})
console.log('form:', form.value)
</script>
<template>
  <div class="wrap">
    <div class="banner inner">
      <div class="banner__title III-block-white">
        <h2>一趟長達 30 年的旅程即將啟航</h2>
        <p>
          『準備開始倒數 10,9,8,7......糟糕，燃料似乎嚴重不足』 馬上開啟你的退休儀錶板，使用全新搭載
          Triple-I 所研發的超級計算機！！
        </p>
      </div>
      <img src="./assets/images/T-fuel.svg" alt="T-fuel" />
    </div>
    <div class="userInfo inner">
      <div class="col-12 col-md-4 col-lg-4 col-xl-3">
        <h4>您的個人資料</h4>
        <div class="III-block-bluemain III-flex">
          <formInput
            :title="'現在年齡'"
            :type="'number'"
            @setValue="form.age = $event"
            :unit="'歲'"
          ></formInput>
          <formInput
            :title="'預計退休年齡'"
            :subTitle="'通常退休為65歲'"
            :type="'number'"
            @setValue="form.retireAge = $event"
            :unit="'歲'"
          ></formInput>
          <formInput
            :title="'開始工作年齡'"
            :type="'number'"
            @setValue="form.workAge = $event"
            :unit="'歲'"
          ></formInput>
          <formInput
            :title="'您的性別'"
            :type="'select'"
            @setValue="form.sex = $event"
          ></formInput>
        </div>
      </div>
      <div class="col-12 col-md-4 col-lg-4 col-xl-3">
        <h4>退休後每個月想花多少錢？</h4>
      </div>
    </div>

    <div class="more">
      <h4>您總共需要：</h4>
      <span>$$$$</span>
    </div>
    <div class="result inner">
      result
      <div class="left">
        <div class="btnMonth">btnMonth</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  padding-top: 60px;
}
</style>
