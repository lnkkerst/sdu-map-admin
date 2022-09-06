<script lang="ts" setup>
import { isDark, toggleDark } from '~/composables/dark';

const drawerCollapse = $ref(false);
const links = [
  {
    icon: 'map-marker',
    title: 'new_map'
  }
];
const active = ref(false);
const { t } = useI18n();
</script>

<template>
  <var-app-bar class="fixed h-12 z-60">
    {{ t('title') }}
    <template #left>
      <var-button
        round
        text
        class="mx-1"
        @click="drawerCollapse = !drawerCollapse"
      >
        <var-icon name="menu"></var-icon>
      </var-button>
    </template>

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

  <var-popup v-model:show="drawerCollapse" position="left" class="min-w-56">
    <var-list>
      <template v-for="link in links" :key="link.title">
        <DrawerLink :active="active" indicator @click="active = !active">
          <template #icon>
            <var-icon class="i-mdi-map mr-3"></var-icon>
          </template>
          <template #content>
            <span v-t="{ path: `drawer.list.${link.title}` }"></span>
          </template>
        </DrawerLink>
      </template>
    </var-list>
  </var-popup>
  <div class="h-full pt-12">
    <div class="h-full">
      <router-view></router-view>
    </div>
  </div>
</template>
