import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1000,
  duration: '300s',
};

const url = __ENV.BACKEND_URL ?? 'http://backend_grupo8:3000';
const user = {
  username: __ENV.USER ?? 'purchaser',
  password: __ENV.PASSWORD ?? 'Purchaser1234!',
};
const searchText = 'zapatillas';

export function setup() {
  const res = http.post(`${url}/auth/login`, user);
  return { Authorization: `Bearer ${res.json().access_token}` };
}

export default function ({ Authorization }) {
  let res = http.get(`${url}/product/search?q=${searchText}`, {
    headers: { Authorization },
  });
  check(res, { 'status is 200': (res) => res.status === 200 });
  sleep(1);
}
