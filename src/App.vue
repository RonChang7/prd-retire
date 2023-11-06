<script setup>
import formInput from './components/formInput.vue'
import { watch, computed, ref, reactive } from 'vue'
import axios from 'axios'
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
  retirePlan: 'once',
  salary: 0,
  //目前累積的退休準備
  nowSaves: 0,
  nowInvestment: 0,
  nowOthers: 0,
  //退休後每年為自己準備
  annualMoney: 0,
  annualRent: 0,
  annualOthers: 0,
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
const setFormValue = (key, value) => {
  if (form[key] === value) return
  if (key === 'lifePlan') {
    form.perMoneySpend = value === 4 ? form.freeSpend : lifePlanType[value - 1].amount
  }
  form[key] = value
  console.log('form:', form)
  getCalculationFromApi()
}
watch(
  () => form.freeSpend,
  (newVal) => {
      form.lifePlan = newVal < 70000 ? 1 : newVal >= 70000 && newVal < 100000 ? 2 : 3
      form.perMoneySpend = newVal
      getCalculationFromApi()
    
  }
)
// TODO:呼喚時機：現在年齡、預計退休年齡、性別、退休後每個月想花多少錢變動時
const getCalculationFromApi = async () => {
  const url = `https://3i-life.com.tw/product/calculationRetireSimple?gender=${form.sex}&estimateRetireAge=${form.retireAge}&wantCostAfterRetirePerMonth=${form.perMoneySpend}`
  await axios
    .get(url)
    .then((res) => {
      console.log(res)
      result.costAfterRetire = res.data
    })
    .catch((err) => {
      console.log(err)
    })
}

const result = reactive({
  costAfterRetire: 0,
  wagePerMonth: 0,
  retirePay: 'all',
})
const toggleResult = ref(false)
const getMoreDetail = () => {
  if (!toggleResult.value) toggleResult.value = true
  // TODO:滑動調整 display:none 或是不存在時有問題
  console.log(document.querySelector('#checkResult'))
  document.documentElement.scrollTop = document.querySelector('#checkResult').offsetTop
}
const preparedList = reactive([
  {
    title: '目前累積的退休準備',
    toggle: false,
    inputList: [
      {
        name: '儲蓄',
        value: 0,
        unit: '元',
      },
      {
        name: '投資',
        value: 0,
        unit: '元',
      },
      {
        name: '其他',
        value: 0,
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
        unit: '元/年',
      },
      {
        name: '房租',
        value: 0,
        unit: '元/年',
      },
      {
        name: '其他',
        value: 0,
        unit: '元/年',
      },
    ],
  },
])
const preparedNow = computed(() => {
  return preparedList[0].inputList.reduce((sum, b) => {
    return sum + b.value
  }, 0)
})
const preparedAnnual = computed(() => {
  return preparedList[1].inputList.reduce((sum, b) => {
    return sum + b.value
  }, 0)
})
const completePercentage = computed(() => 0)
const legendList = reactive([
  {
    name: '已准備退休金總額',
    color: '#ff6a82',
    value: 0,
  },
  {
    name: '勞保',
    color: '#ffba00',
    value: 0,
  },
  {
    name: '勞退',
    color: '#c3275c',
    value: 0,
  },
  {
    name: '退休金缺口',
    color: '#1e2b58',
    value: 0,
  },
])
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
            :type="'number'"
            @setValue="setFormValue('age', $event)"
            :unit="'歲'"
          ></formInput>
          <formInput
            :title="'預計退休年齡'"
            :subTitle="'通常退休為65歲'"
            :type="'number'"
            @setValue="setFormValue('retireAge', $event)"
            :unit="'歲'"
          ></formInput>
          <formInput
            :title="'開始工作年齡'"
            :type="'number'"
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
              <p>{{ item.amount }} 元/月</p>
            </div>
            <div class="retire__btn">
              <span>人生自己填</span>
              <div class="form_item">
                <input class="form-md" type="number" placeholder="0" v-model="form.freeSpend" />
                <label data-domain="元/月"></label>
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
      <span>{{ result.costAfterRetire }}元</span>
      <button class="III-btn III-btn-outline--white" @click="getMoreDetail">
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
              :class="{ 'result__btn--active': result.retirePay === 'month' }"
              @click="result.retirePay = 'month'"
            >
              退休後每月領
            </button>
            <button
              class="result__btn"
              :class="{ 'result__btn--active': result.retirePay === 'all' }"
              @click="result.retirePay = 'all'"
            >
              退休後一次領
            </button>
          </div>
          <div class="result__wages III-flex">
            <span>每月薪資：</span>
            <div class="form_item">
              <input class="form-md" type="number" placeholder="0" v-model="result.wagePerMonth" />
              <label data-domain="元/月"></label>
            </div>
          </div>
          <div class="result__prepared prepared">
            <div class="prepared__block" v-for="(item, index) in preparedList" :key="index">
              <div
                class="prepared__toggleItem col-12 col-md-12"
                @click="item.toggle = !item.toggle"
              >
                <p>{{ item.title }}</p>
                <p v-if="index === 0" class="prepared__money">{{ preparedNow }}元</p>
                <p v-else class="prepared__money">{{ preparedAnnual }}元</p>
              </div>
              <div v-if="item.toggle" class="prepared__inputBlock">
                <div
                  v-for="el in item.inputList"
                  :key="index"
                  class="prepared__inputItem form_item"
                >
                  <p>{{ el.name }}:</p>
                  <input class="form-md" type="number" min="0" step="1000" v-model="el.value" />
                  <label :data-domain="el.unit"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="result__block chart col-12 col-md-6">
          <div class="chart__wrap">
            <div class="chart__pie">恰特</div>
            <div class="chart__percentage">
              <h5>退休完成度</h5>
              <p>{{ completePercentage }}%</p>
            </div>
          </div>
          <ul class="chart__legendList">
            <li v-for="(item, index) in legendList" :key="index">
              <div>
                <span class="legend" :style="`background:${item.color}`"> </span>
                <span>{{ item.name }}</span>
              </div>
              <p>{{ item.value }} 元</p>
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
                  <span class="stillLackAmount">0</span>元
                </li>
                <div class="line"></div>
                <li class="data_block col-12">
                  <p>建議您每月再存</p>
                  <span id="saveAmountPerMonth">0</span>元
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
        <button class="III-btn btn-square III-btn-outline--mainblue" onclick="window.print()">
          <i class="fas fa-print"></i> 列印試算結果
        </button>
      </div>
      <p>本功能僅為試算功能，均以新臺幣為計算基準，相關的分析及試算結果，僅供參考使用。</p>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
