<template>
  <div id="chart" style="width: 550px"></div>
  <div class="chart__complete">
    <input hidden id="ratio" />
    <p class="p-none">
      退休完成度<br />
      <span>{{ props.completePercentage }} %</span>
    </p>
  </div>
</template>

<script setup>
import { defineEmits, watch, onMounted } from 'vue'
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useStore } from '../stores/store'
echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout])

const store = useStore()
const emit = defineEmits(['percentRun'])
const props = defineProps({
  completePercentage: {
    type: Number,
    default: 0,
  },
})

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
  // emit('percentRun')

  return myChart
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
