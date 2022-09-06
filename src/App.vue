<script setup lang="ts">
import { StyleProvider } from '@varlet/ui';
import dark from '@varlet/ui/es/themes/dark';
import { isDark } from './composables/dark';

onMounted(() => {
  StyleProvider(isDark.value ? dark : null);
});
</script>

<template>
  <RouterView />
</template>

<style></style>
