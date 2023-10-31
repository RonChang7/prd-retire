<template>
  <div class="form_item formItem">
    <p>
      {{ props.title }}:
      <br />
      <span v-if="props.subTitle?.length">({{ props.subTitle }})</span>
    </p>
    <template v-if="props.type === 'number'">
      <input
        class="form-md outline_w"
        type="number"
        :placeholder="placeholder"
        v-model="val"
        @blur="$emit('setValue', val)"
      />
      <label :data-domain="props.unit"></label>
    </template>
    <template v-if="props.type === 'select'">
      <div class="d-flex selectItem">
        <button
          v-for="(item, index) in btnList"
          :key="index"
          class="selectItem__btn"
          :class="{ 'selectItem__btn--active': val === item.value }"
          @click="$emit('setValue', item.value), (val = item.value)"
        >
          <i class="fas" :class="item.name"></i>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  type: String,
  title: String,
  subTitle: String,
  unit: String,
  placeholder: {
    type: Number,
    default: 0,
  },
})
const val = ref(null)
const btnList = [
  { name: 'fa-mars', value: 1 },
  { name: 'fa-venus', value: 2 },
]
</script>

<style lang="scss" scoped></style>
