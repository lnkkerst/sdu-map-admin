import dark from '@varlet/ui/es/themes/dark';
import { StyleProvider } from '@varlet/ui';

export const isDark = useDark({
  onChanged(newDarkVal: boolean) {
    StyleProvider(newDarkVal ? dark : null);
  }
});

export const toggleDark = useToggle(isDark);
