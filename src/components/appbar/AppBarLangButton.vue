<script lang="ts" setup>
const { availableLocales, locale } = useI18n();
availableLocales.reverse();
const currentLocale = useLocalStorage('sdu-map-admin-locale', 'zh-CN');
const setLocale = (newLocale = '') => {
  if (newLocale === '') {
    locale.value = currentLocale.value;
    return;
  }
  currentLocale.value = newLocale;
  locale.value = newLocale;
};
setLocale();
</script>

<template>
  <q-btn>
    <q-menu>
      <q-list>
        <template v-for="item in availableLocales" :key="item">
          <q-item
            v-ripple
            clickable
            :active="locale === item"
            @click="setLocale(item)"
          >
            <q-item-section>
              <span v-t="{ path: 'locale_name', locale: item }"></span>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </q-btn>
</template>
