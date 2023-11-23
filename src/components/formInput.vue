<template>
  <div class="form_item formItem">
    <p v-if="props.title?.length">
      {{ props.title }}:
      <br />
      <span v-if="props.subTitle?.length">({{ props.subTitle }})</span>
    </p>
    <template v-if="props.type === 'number-outline'">
      <input
        class="form-md outline_w"
        type="number"
        v-model="val"
        :placeholder="placeholder"
        :min="props.min"
        :max="props.max"
        @blur="$emit('setValue', val)"
      />
      <label class="outlineLabel" :data-domain="props.unit"></label>
    </template>
    <template v-if="props.type === 'number'">
      <input
        class="form-md number_blue"
        type="number"
        v-model="val"
        :placeholder="placeholder"
        :step="props.step"
        :min="props.min"
        :max="props.max"
        @input="$emit('setValue', val)"
      />
      <label class="numberLabel" :data-domain="props.unit"></label>
    </template>
    <template v-if="props.type === 'select'">
      <div class="d-flex selectItem">
        <button
          v-for="(item, index) in btnList"
          :key="index"
          class="selectItem__btn"
          :class="{ 'selectItem__btn--active': btnVal === item.value }"
          @click="$emit('setValue', item.value)"
        >
          <i class="fas" :class="item.name"></i>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  type: String,
  title: String,
  subTitle: String,
  unit: String,
  btnList: Array,
  btnVal: String,
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 0,
  },
  placeholder: {
    type: Number,
    default: 0,
  },
  step: {
    type: Number,
    default: 1,
  },
})
const val = ref(null)

watch(
  () => val.value,
  (newVal) => {
    if (newVal > props.max) {
      val.value = props.max
    } else if (newVal < props.min) {
      val.value = props.min
    }
  }
)
</script>

<style lang="scss" scoped></style>
