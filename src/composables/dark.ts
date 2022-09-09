import { Dark } from 'quasar';

export const isDark = useDark({
  onChanged(newDarkVal: boolean) {
    Dark.set(newDarkVal);
    document.documentElement.classList.toggle('dark', newDarkVal);
  }
});

export const toggleDark = useToggle(isDark);
