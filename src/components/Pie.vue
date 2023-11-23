<template>
  <div ref="chartContainer" id="chart"></div>
  <div class="chart__complete">
    <input hidden id="ratio" />
    <p class="p-none">
      退休完成度<br />
      <span>{{ props.completePercentage }} %</span>
    </p>
  </div>
</template>

<script setup>
import { defineEmits, watch, onMounted, onBeforeUnmount, nextTick, ref } from 'vue'
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
const chartContainer = ref(null)
let chartInstance = null
// let pie = null
onMounted(function () {
  nextTick(() => {
    initPie()
  })
})
const initPie = () => {
  if (!chartContainer.value) {
    return
  }

  // 檢查是否已有圖表實例
  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartContainer.value)
  window.addEventListener('resize', function () {
    chartInstance.resize()
  })
  let option = {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: ['120%', '130%'],
        center: ['50%', '80%'],
        // adjust the start angle
        startAngle: 180,
        label: {
          show: false,
        },
        data: [
          store.legendList[0],
          store.legendList[1],
          store.legendList[2],
          store.legendList[3],
          {
            // make an record to fill the bottom 50%
            value: store.legendList.reduce((acc, cur) => acc + cur.value, 0),
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

  // option && myChart.setOption(option)
  chartInstance.setOption(option)
}
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
})
/* ---------------------------------- 更新圖表 ---------------------------------- */
watch(
  () => store.legendList,
  (newVal) => {
    if (newVal[3].value > 0) {
      initPie()
    }
  },
  { deep: true }
)

/* --------------------------------- 有值才畫 --------------------------------- */

// const haveData = computed(() => {
//   return store.legendList[3].value > 0 ? true : false
// })
</script>

<style></style>
