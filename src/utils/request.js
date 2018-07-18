

export default function request (method, url, body) {
  method = method.toUpperCase();
  if (method === 'GET') {
    // fetch的GET不允许有body，参数只能放在url中
    body = undefined;
  } else {
    body = body && JSON.stringify(body);
  }

  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      //'Access-Token': sessionStorage.getItem('access_token') || '' // 从sessionStorage中获取access token
	  Authorization:'Bearer nuzvpevmPNOhmlAACsgDrgru4E4MBC-FqGwvxzm0w7mPnYnFUnCliv-72TCmgxoLZbGSnWq-gcP4zvyuUF9JHR-AqOcoNcjgyi7GOPmBIfYPwXMgTmJJjPhhUzi6qDPs6ABzg_yASj8Eac3j91eZCIYKCjzhJ6UuMqlXNzFyCOQlkD0rF07kFlC188-VYn6NTiO1qxwVkiJAbz-EXg-VbV5QPt_3wCwfqCjfvxRtlk7hrXsecjzUcWs6nZt4HFxKjBnvXsL9q-X_0W1SbbezVvBbOvmKVg2Q6UNC7iGJSK4lcWllcD8F0hQyfRrmJUT8SXPXJtDuN_Ab7rnZkfNzTK-GXg81N48FQLJM4FTB5CUqJUSQ8A0dYoM2PSxYjIv6'
    },
    body
  })
  .then((res) => {
    if (res.status === 401) {
	  //window.location.href = '/login';
	  //return '401';
      return Promise.reject('Unauthorized.');
    } else {
    //  const token = res.headers.get('access-token');
    //  if (token) {
    //    sessionStorage.setItem('access_token', token);
    //  }
      return res.json();
    }
  });
}

export const get = (url) => request('GET', url);
export const post = (url, body) => request('POST', url, body);
export const put = (url, body) => request('PUT', url, body);
export const del = (url, body) => request('DELETE', url, body);