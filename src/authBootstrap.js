// authBootstrap.ts
import { api } from './api';

export async function initCsrf() {
  const { data } = await api.get('/auth/csrf'); // sets PHPSESSID cookie
  api.defaults.headers.common['X-CSRF-TOKEN'] = data.csrfHash; // or send as form field
}
