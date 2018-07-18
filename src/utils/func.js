

function getQueryString(name) { 
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
  var r = window.location.search.substr(1).match(reg); 
  if (r !== null) return unescape(r[2]); 
  return null; 
}
//console.log(getQueryString('token'));
function appendObjectParams(params) {
  var keys = Object.keys(params);
  let result = '';
  for (var i = 0; i < keys.length; i++) { 
    var key = keys[i];
	result += key + '=' + params[key];
    if (i !== keys.length - 1) {
      result += '&';
    }
  }
  return result;
}


function loginToSetToken(account,password,page){
  let body = {
    client_id:account,
    client_secret:password,
    grant_type:'client_credentials'
  };
  console.log(appendObjectParams(body));
  fetch(sessionStorage.apiUrl + '/Token', {
    method:'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body:appendObjectParams(body)
  }).then(res => {
    return res.json();
  }).then(res => {
    sessionStorage.setItem('Authorization','Bearer ' + res.access_token);
	//page.props.history.push(window.location.hash.substring(1));
	
	//window.location.reload()
	page && page.setState({
	  hasToken:!(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' )
	});
  })
}

export {appendObjectParams,getQueryString,loginToSetToken};