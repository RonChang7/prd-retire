<template>
  <div class="form_item formItem">
    <p>
      {{ props.title }}:
      <br />
      <span v-if="props.subTitle?.length">({{ props.subTitle }})</span>
    </p>
    <template v-if="props.type === 'number'">
      <input
        class="form-md outline_w check_change"
        type="number"
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
import { ref, defineProps } from 'vue'
const props = defineProps({
  type: String,
  title: String,
  subTitle: String,
  unit: String,
})
const val = ref(null)
const btnList = [
  { name: 'fa-mars', value: 1 },
  { name: 'fa-venus', value: 2 },
]
</script>

<style lang="scss" scoped>
.formItem {
  width: 100%;
  color: white;
  background-color: $color-primary-blue;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  &:last-of-type {
    margin-bottom: 0;
  }

  p {
    width: 55%;
  }
  input,
  .selectItem {
    width: 45%;
    color: #ffffff;
  }
  label::after {
    color: #ffffff;
    right: 10px;
    top: -10px;
  }
  .selectItem {
    display: flex;
    justify-content: space-between;
    &__btn {
      width: 48%;
      height: 36px;
      border-radius: $border-radius;
      border: 1px solid white;
      color: #ffffff;
      background-color: $color-primary-blue;
    }
    &__btn--active {
      border-radius: $border-radius;
      color: $color-primary-blue;
      background-color: #ffffff;
    }
  }
}
</style>
