import axios from "axios";

export function get(path, params) {
  const url = `${path}`;

  return axios({
    method: "get",
    url,
    params,
    withCredentials: true
  }).then(resp => resp.data);
}

export function post(path, data, params) {
  const url = `${path}`;

  return axios({
    method: "post",
    url,
    data,
    params,
    withCredentials: true
  });
}
