<template>
  <div id="chart" style="width: 550px"></div>
  <div class="chart__complete">
    <input hidden id="ratio" />
    <p class="p-none">
      退休完成度<br />
      <span id="completePercentage"></span>%
    </p>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useStore } from '../stores/store'
const store = useStore()
echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout])

let pie = null
onMounted(function () {
  pie = createPie()
})
const createPie = () => {
  let chartDom = document.getElementById('chart')
  let myChart = echarts.init(chartDom)
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
      // doesn't perfectly work with our tricks, disable it
      selectedMode: false,
    },
    series: [
      {
        // name: '',
        type: 'pie',
        radius: ['60%', '70%'],
        center: ['40%', '100%'],
        // adjust the start angle
        startAngle: 180,
        label: {
          show: false,
          // formatter(param) {
          //   // correct the percentage
          //   return param.name + ' (' + param.percent * 2 + '%)'
          // },
        },
        data: [
          store.legendList[0],
          store.legendList[1],
          store.legendList[2],
          store.legendList[3],
          {
            // make an record to fill the bottom 50%
            value: 0,
            itemStyle: {
              // stop the chart from rendering this piece
              color: 'none',
              decal: {
                symbol: 'none',
              },
            },
            label: {
              show: false,
            },
          },
        ],
      },
    ],
  }

  option && myChart.setOption(option)
  return myChart
}

function createChart(a, b, c, d) {
  const ctx = document.querySelector('#doughnut').getContext('2d')
  let data = {
    labels: ['已備退休金總額', '勞退', '勞保', '退休金缺口'],
    datasets: [
      {
        label: 'Triple-i',
        data: [202, 333, 222, 577],
        backgroundColor: ['#FF6A82', '#C3275C', '#FFBA00', '#1E2B58'],
        borderColor: [
          'rgba(255, 255, 255 ,1)',
          'rgba(255, 255, 255 ,1)',
          'rgba(255, 255, 255 ,1)',
          'rgba(255, 255, 255 ,1)',
        ],
        borderWidth: 2,
      },
    ],
  }
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data,
    options: {
      cutout: '90%',
      rotation: -90,
      circumference: 180,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  })
  animateValue('completePercentage', 0, Math.round(ratio * 100), 1000)

  return chart
}
// 數字從0開始跑的動畫
function animateValue(id, start, end, duration) {
  if (start === end) return
  let range = end - start
  let current = start
  let increment = end > start ? 1 : -1
  let stepTime = Math.abs(Math.floor(duration / range))
  let obj = document.getElementById(id)
  let timer = setInterval(function () {
    current += increment
    obj.innerHTML = current
    if (current == end) {
      clearInterval(timer)
    }
  }, stepTime)
}

/* ---------------------------------- 更新圖表 ---------------------------------- */
watch(
  () => store.legendList,
  (newVal) => {
    if (pie) {
      createPie()
    }
  },
  { deep: true, immediate: true }
)

/* --------------------------------- 有值才能碰 --------------------------------- */
// const haveData = computed(() => {
//   return Object.keys(trendData.value).length > 0 ? true : false
// })
window.addEventListener('resize', function () {
  myChart.resize()
})
</script>

<style></style>
