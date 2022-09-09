<script setup lang="ts">
import { useQuasar } from 'quasar';
onMounted(() => {
  useQuasar().dark.set(isDark.value);
});
</script>

<template>
  <RouterView />
</template>

<style></style>
