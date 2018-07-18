

export default function request (method, url, body,currentPage) {
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
	  Authorization: sessionStorage.Authorization  || ''
    },
    body
  })
  .then((res) => {
    if (res.status === 401) {
	  //window.location.href = '/login';
	  //return '401';
	 // currentPage && currentPage.props.history.push('/login');
	  window.location.href = '#/login';
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

export const get = (url,currentPage) => request('GET', url,'',currentPage);
export const post = (url, body,currentPage) => request('POST', url, body,currentPage);
export const put = (url, body,currentPage) => request('PUT', url, body,currentPage);
export const del = (url, body,currentPage) => request('DELETE', url, body,currentPage);