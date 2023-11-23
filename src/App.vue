<script setup>
import Pie from '@/components/Pie.vue'
import formInput from './components/formInput.vue'
import { watch, computed, ref, reactive, nextTick } from 'vue'
import { useStore } from './stores/store'
import _ from 'lodash'
import Swal from 'sweetalert2'

const store = useStore()
const form = reactive({
  //個人資料
  age: 0,
  retireAge: 0,
  workAge: 0,
  sex: 'MALE',
  //退休後每個月想花多少
  lifePlan: 1,
  perMoneySpend: 40000,
  freeSpend: 0,
  payType: 'ONCE',
  salary: 0,
})
const btnList = [
  { name: 'fa-mars', value: 'MALE' },
  { name: 'fa-venus', value: 'FEMALE' },
]
const lifePlanType = [
  { id: 1, title: '平靜樂活人生包', amount: 40000 },
  { id: 2, title: '偶爾炫耀歡樂包', amount: 70000 },
  { id: 3, title: '豪華享樂富裕包', amount: 100000 },
]
const lifePlanInfo = [
  { food: '家庭小吃', transport: '多半是大眾運輸', health: '健保補助病房', travel: '國內走透透' },
  { food: '餐廳美食', transport: '擁有私家車', health: '自費雙人病房', travel: '國外輕旅行' },
  { food: '米其林餐廳', transport: '私人司機接送', health: '自費單人病房', travel: '國外秘境探險' },
]
const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
const setFormValue = async (key, value, index, i) => {
  if (form[key] === value) return
  if (key === 'lifePlan') {
    form.perMoneySpend = value === 4 ? form.freeSpend : lifePlanType[value - 1].amount
  }
  if (key === 'prepared') {
    preparedList[index].inputList[i].value = value
  }
  form[key] = value

  debouncedGetCostAfterRetire()
}
const getCostAfterRetireFromApi = async () => {
  const res = await store.getCostAfterRetire(form)
  if (!res) return
  return (result.costAfterRetire = res)
}
const debouncedGetCostAfterRetire = _.debounce(getCostAfterRetireFromApi, 500)

watch(
  () => form.freeSpend,
  async (newVal) => {
    form.lifePlan = newVal < 70000 ? 1 : newVal >= 70000 && newVal < 100000 ? 2 : 3
    form.perMoneySpend = newVal

    const res = await debouncedGetCostAfterRetire()
    if (res) result.costAfterRetire = res
  }
)

const result = reactive({
  costAfterRetire: 0,
  stillLackAmount: 0,
  saveAmountPerMonth: 0,
})
watch(
  () => form.payType,
  (newVal) => {
    if (newVal) {
      debouncedGetCalculation()
    }
  }
)
watch(
  () => form.salary,
  (newVal) => {
    if (newVal > 0) {
      debouncedGetCalculation()
    }
  }
)
const toggleResult = ref(false)

const getCalculationFromApi = async () => {
  const res = await store.getCalculation(form, preparedNow.value, preparedAnnual.value)
  if (!res) return
  if (res.errorMessage.length) {
    return Swal.fire({
      titleText: '請重新輸入',
      text: res.errorMessage[0],
      icon: 'warning',
    })
  }
  const { laborProtectionAmount, laborRebateAmount, stillLackAmount, saveAmountPerMonth } = res
  result.stillLackAmount = stillLackAmount > 0 ? formatNumberWithCommas(stillLackAmount) : 0
  result.saveAmountPerMonth =
    saveAmountPerMonth > 0 ? formatNumberWithCommas(saveAmountPerMonth) : 0
  const mappingValues = [preparedNow, laborProtectionAmount, laborRebateAmount, stillLackAmount]
  store.legendList.forEach((item, index) => {
    item.value = mappingValues[index]
  })
  let total = store.legendList.reduce((sum, b) => {
    return sum + b.value
  }, 0)
  let ratio = (total - store.legendList[3].value) / total

  if (!toggleResult.value) {
    toggleResult.value = true
  }
  nextTick(() => {
    window.scrollTo({
      top: document.querySelector('#checkResult').offsetTop - 100,
      behavior: 'smooth',
    })

    animateValue(Math.round(ratio * 100))
  })
}

const debouncedGetCalculation = _.debounce(getCalculationFromApi, 500)

const preparedList = reactive([
  {
    title: '目前累積的退休準備',
    toggle: false,
    inputList: [
      {
        name: '儲蓄',
        value: 0,
        max: 100000000,
        unit: '元',
      },
      {
        name: '投資',
        value: 0,
        max: 100000000,
        unit: '元',
      },
      {
        name: '其他',
        value: 0,
        max: 100000000,
        unit: '元',
      },
    ],
  },
  {
    title: '退休後每年為自己準備',
    toggle: false,
    inputList: [
      {
        name: '年金',
        value: 0,
        max: 50000000,
        unit: '元/年',
      },
      {
        name: '房租',
        value: 0,
        max: 50000000,
        unit: '元/年',
      },
      {
        name: '其他',
        value: 0,
        max: 50000000,
        unit: '元/年',
      },
    ],
  },
])
const preparedNow = computed(() => {
  return preparedList[0].inputList.reduce((sum, b) => {
    return sum + Number(b.value)
  }, 0)
})
watch(
  () => preparedNow.value,
  (newVal) => {
    if (newVal > 0) {
      debouncedGetCalculation()
    }
  }
)
const preparedAnnual = computed(() => {
  return preparedList[1].inputList.reduce((sum, b) => {
    return sum + Number(b.value)
  }, 0)
})
watch(
  () => preparedAnnual.value,
  (newVal) => {
    if (newVal > 0) {
      debouncedGetCalculation()
    }
  }
)
const completePercentage = ref(0)
// 數字從0開始跑的動畫 卡卡的
const animateValue = (end) => {
  if (end === 0) return
  if (end >= 100) return (completePercentage.value = 100)
  let current = 0
  let increment = end >= 1 ? 1 : -1
  let stepTime = Math.abs(Math.floor(1000 / end))
  let timer = setInterval(function () {
    current += increment
    completePercentage.value = current
    if (current === end) {
      clearInterval(timer)
    }
  }, stepTime)
}
//TODO: 假資料
const isShowPDF = ref(true)
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
        <img src="./assets/images/T-fuel.svg" alt="T-fuel" />
      </div>
    </div>
    <div class="formInfo inner">
      <div class="userInfo col-12 col-md-4 col-lg-4 col-xl-3">
        <h4>您的個人資料</h4>
        <div class="III-block-bluemain III-flex itemBlock">
          <formInput
            :title="'現在年齡'"
            :type="'number-outline'"
            :max="60"
            @setValue="setFormValue('age', $event)"
            :unit="'歲'"
          ></formInput>
          <formInput
            :title="'預計退休年齡'"
            :subTitle="'通常退休為65歲'"
            :max="75"
            :type="'number-outline'"
            @setValue="setFormValue('retireAge', $event)"
            :unit="'歲'"
          ></formInput>
          <formInput
            :title="'開始工作年齡'"
            :type="'number-outline'"
            :max="40"
            @setValue="setFormValue('workAge', $event)"
            :unit="'歲'"
          ></formInput>
          <formInput
            :title="'您的性別'"
            :type="'select'"
            :btn-list="btnList"
            :btn-val="form.sex"
            @setValue="setFormValue('sex', $event)"
          ></formInput>
        </div>
      </div>
      <div class="retire col-12 col-md-8 col-lg-8 col-xl-9">
        <h4>退休後每個月想花多少錢？</h4>
        <div class="retire__wrap">
          <div class="retire__subWrap">
            <div
              class="retire__btn"
              :class="{ 'retire__btn--active': form.lifePlan === item.id }"
              v-for="(item, index) in lifePlanType"
              :key="index"
              @click="setFormValue('lifePlan', item.id)"
            >
              <span>{{ item.title }}</span>
              <p>{{ formatNumberWithCommas(item.amount) }} 元/月</p>
            </div>
            <div class="retire__btn">
              <span>人生自己填</span>
              <div class="form_item">
                <formInput
                  :type="'number'"
                  :placeholder="0"
                  :min="5000"
                  :max="600000"
                  :step="1000"
                  :unit="'元/月'"
                  @setValue="setFormValue('freeSpend', $event)"
                ></formInput>
              </div>
            </div>
          </div>
          <div class="col-12 III-block-bluemain III-flex itemBlock">
            <div class="retire__life col-6 col-md-3">
              <i class="fas fa-utensils"></i>
              <p>{{ lifePlanInfo[form.lifePlan - 1].food }}</p>
            </div>
            <div class="retire__life col-6 col-md-3">
              <i class="fas fa-car"></i>
              <p>{{ lifePlanInfo[form.lifePlan - 1].transport }}</p>
            </div>
            <div class="retire__life col-6 col-md-3">
              <i class="fas fa-briefcase-medical"></i>
              <p>{{ lifePlanInfo[form.lifePlan - 1].health }}</p>
            </div>
            <div class="retire__life col-6 col-md-3">
              <i class="fas fa-map-marked-alt"></i>
              <p>{{ lifePlanInfo[form.lifePlan - 1].travel }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="moreDetail">
      <h4>您總共需要：</h4>
      <span>{{ formatNumberWithCommas(result.costAfterRetire) }}元</span>
      <button class="III-btn III-btn-outline--white" @click="debouncedGetCalculation">
        我想要更詳細的資料
      </button>
    </div>
    <div id="checkResult" v-show="toggleResult" class="result inner III-block-white">
      <h4>查看你的結果</h4>
      <div class="III-flex result__wrap">
        <div class="result__block col-12 col-md-6">
          <div class="result__btns">
            <button
              class="result__btn"
              :class="{ 'result__btn--active': form.payType === 'MONTH' }"
              @click="form.payType = 'MONTH'"
            >
              退休後每月領
            </button>
            <button
              class="result__btn"
              :class="{ 'result__btn--active': form.payType === 'ONCE' }"
              @click="form.payType = 'ONCE'"
            >
              退休後一次領
            </button>
          </div>
          <div class="result__wages III-flex">
            <div class="form_item">
              <formInput
                :title="'每月薪資'"
                :type="'number'"
                :max="600000"
                :step="1000"
                :unit="'元/月'"
                @setValue="setFormValue('salary', $event)"
              ></formInput>
            </div>
          </div>
          <div class="result__prepared prepared">
            <div class="prepared__block" v-for="(item, index) in preparedList" :key="index">
              <div
                class="prepared__toggleItem col-12 col-md-12"
                @click="item.toggle = !item.toggle"
              >
                <p>{{ item.title }}</p>
                <p v-if="index === 0" class="prepared__money">
                  {{ formatNumberWithCommas(preparedNow) }}元
                </p>
                <p v-else class="prepared__money">{{ formatNumberWithCommas(preparedAnnual) }}元</p>
              </div>
              <div v-if="item.toggle" class="prepared__inputBlock">
                <div
                  v-for="(el, i) in item.inputList"
                  :key="index"
                  class="prepared__inputItem form_item"
                >
                  <formInput
                    :title="el.name"
                    :type="'number'"
                    :max="el.max"
                    :step="1000"
                    :unit="el.unit"
                    @setValue="setFormValue('prepared', $event, index, i)"
                  ></formInput>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="result__block chart col-12 col-md-6 w-100">
          <Pie v-if="toggleResult" :completePercentage="completePercentage"></Pie>
          <ul class="chart__legendList">
            <li v-for="(el, index) in store.legendList" :key="index">
              <div>
                <span class="legend" :style="`background:${el.itemStyle.color}`"> </span>
                <span>{{ el.name }}</span>
              </div>
              <p>{{ formatNumberWithCommas(el.value) }} 元</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="shape-triangle">
        <div class="triangle"></div>
      </div>
      <div class="result_data--btm">
        <div class="III-block-bluemain">
          <div class="III-wrap">
            <div class="III-flex">
              <ul>
                <li class="data_block col-12">
                  <p>您與理想生活的差距</p>
                  <span class="stillLackAmount">{{ result.stillLackAmount }}</span
                  >元
                </li>
                <div class="line"></div>
                <li class="data_block col-12">
                  <p>建議您每月再存</p>
                  <span id="saveAmountPerMonth">{{ result.saveAmountPerMonth }}</span
                  >元
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="retire--share">
      <div class="share_btns">
        <p>
          分享試算結果：<a href="#"><i class="fab fa-line"></i></a>
          <a href="#"><i class="fab fa-facebook-square"></i></a>
        </p>
        <button class="III-btn btn-square III-btn-outline--mainblue" @click="window.print()">
          <i class="fas fa-print"></i> 列印試算結果
        </button>
      </div>
      <p>本功能僅為試算功能，均以新臺幣為計算基準，相關的分析及試算結果，僅供參考使用。</p>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
