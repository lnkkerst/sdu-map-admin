<script setup lang="ts">
import { Ripple as vRipple } from '@varlet/ui';
const props = withDefaults(
  defineProps<{
    icon?: string;
    title?: string;
    active?: boolean;
    rounded?: boolean;
    indicator?: boolean;
  }>(),
  { icon: '', title: '', active: false, rounded: false, indicator: false }
);
const backgroundColor = ref('');

const updateBackgroundColor = () => {
  const currentPrimaryColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue('--color-primary');
  backgroundColor.value = props.active
    ? `${currentPrimaryColor}2f`
    : 'transparent';
};

watch(props, () => {
  updateBackgroundColor();
});

onMounted(() => {
  updateBackgroundColor();
});
</script>

<template>
  <var-cell
    v-ripple="{ color: 'var(--color-primary)' }"
    class="px-4 py-2 drawer-link cursor-pointer"
    :class="[active ? 'active' : 'inactive', { 'rounded-md': rounded }]"
    :style="{
      backgroundColor,
      boxShadow: indicator ? '' : 'none',
      animation: indicator ? '' : 'none'
    }"
  >
    <slot name="icon">
      <span class="mr-3">
        <var-icon v-if="props.icon" :name="props.icon"></var-icon>
      </span>
    </slot>
    <slot name="content">
      <span>{{ props.title }}</span>
    </slot>
    {{}}
  </var-cell>
</template>

<style scoped>
.active {
  box-shadow: inset 5px 0 var(--color-primary);
  color: var(--color-primary);
  animation: fadeIn 0.2s;
}
.inactive {
  color: var(--color-text);
  animation: fadeOut 0.2s;
}

@keyframes fadeIn {
  from {
    color: var(--color-text);
    box-shadow: inset 5px 0 transparent;
  }
  to {
    color: var(--color-primary);
    box-shadow: inset 5px 0 var(--color-primary);
  }
}

@keyframes fadeOut {
  from {
    color: var(--color-primary);
    box-shadow: inset 5px 0 var(--color-primary);
  }
  to {
    color: var(--color-text);
    box-shadow: inset 5px 0 transparent;
  }
}
</style>
