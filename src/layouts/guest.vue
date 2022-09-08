<script lang="ts" setup>
import { isDark, toggleDark } from '~/composables/dark';

const { t } = useI18n();
</script>

<template>
  <var-app-bar class="fixed h-12 z-60">
    {{ t('title') }}

    <template #right>
      <ToolbarLanguageButton round text color="transparent" class="mr-1">
        <var-icon class="i-mdi-translate-variant"></var-icon>
      </ToolbarLanguageButton>
      <var-button round text @click="() => toggleDark()">
        <var-icon v-show="!isDark" class="i-mdi-white-balance-sunny"></var-icon>
        <var-icon v-show="isDark" class="i-mdi-weather-night"></var-icon>
      </var-button>
    </template>
  </var-app-bar>

  <div class="h-full pt-12">
    <div class="h-full">
      <router-view></router-view>
    </div>
  </div>
</template>
