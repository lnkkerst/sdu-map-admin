<script setup lang="ts">
const { availableLocales, locale } = useI18n();
availableLocales.reverse();
const active = $ref(false);
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

<script lang="ts">
export default defineComponent({
  inheritAttrs: false
});
</script>

<template>
  <var-menu v-model:show="active" :offset-y="42" :offset-x="-20">
    <var-button v-bind="$attrs" @click="active = !active">
      <slot />
    </var-button>

    <template #menu>
      <div style="background-color: var(--color-body)">
        <DrawerLink
          v-for="(item, index) in availableLocales"
          :key="index"
          class="cursor-pointer"
          :active="locale === item"
          @click="setLocale(item)"
        >
          <template #content>
            <span v-t="{ path: 'locale_name', locale: item }"></span>
          </template>
        </DrawerLink>
      </div>
    </template>
  </var-menu>
</template>

<style scoped></style>
