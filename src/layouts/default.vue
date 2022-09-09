<script lang="ts" setup>
const { t } = useI18n();

const leftDrawerOpen = $ref(false);
</script>

<template>
  <q-layout view="hhh LpR fFf">
    <q-header reveal elevated dark:bg-black>
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          {{ t('title') }}
        </q-toolbar-title>
        <q-space></q-space>
        <q-btn
          flat
          round
          :icon="isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
          @click="() => toggleDark()"
        ></q-btn>
        <AppBarLangButton flat round icon="mdi-translate"></AppBarLangButton>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>
