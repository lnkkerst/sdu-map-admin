<script lang="ts" setup>
import { useQuasar } from 'quasar';

const isDark = useDark();
const toggleDark = (newDarkVal: boolean | undefined = undefined) => {
  if (newDarkVal !== undefined) {
    isDark.value = newDarkVal;
    useQuasar().dark.set(newDarkVal);
  } else {
    isDark.value = !isDark.value;
    useQuasar().dark.toggle();
  }
};
</script>

<template>
  <q-btn @click="() => toggleDark()"> </q-btn>
</template>
