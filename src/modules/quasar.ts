import '@quasar/extras/mdi-v6/mdi-v6.css';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import { Notify, Quasar } from 'quasar';
import quasarIconSet from 'quasar/icon-set/mdi-v6';
import type { UserModule } from '~/types';

export const install: UserModule = ({ app }) => {
  app.use(Quasar, {
    plugins: [Notify],
    iconSet: quasarIconSet
  });
};
