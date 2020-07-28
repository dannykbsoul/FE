//核心都是ajax操作： JQ中的$.ajax是帮我们封装好的ajax库； axios也是基于Promise封装的ajax库 *
//fetch是浏览器内置的发送请求的类（ 天生就是Promise管控的） 

/* 
 * AJAX的状态：xhr.readyState
 *   UNSENT 0  创建完XHR默认就是0
 *   OPENED 1  已经完成OPEN操作
 *   HEADERS_RECEIVED 2 服务器已经把响应头信息返回了
 *   LOADING 3  响应主体正在返回中
 *   DONE 4 响应主体已经返回
 * 
 * XHR.OPEN第三个参数控制的同步异步指的是：从当前SEND发送请求，算任务开始，一直到AJAX状态为4才算任务结束（同步是：在此期间所有的任务都不去处理，而异步是：在此期间该干啥干啥）  =>异步在SEND后，会把这个请求的任务放在EventQueue中（宏任务）
 */
let xhr = new XMLHttpRequest;
xhr.open('get', './js/fastclick.js', true);
// console.log(xhr.readyState); //=>1
xhr.onreadystatechange = function () {
  //=>监听到状态改变后才会触发的事件
  console.log(xhr.readyState); //=>2,3,4
};
xhr.send();

/* let xhr = new XMLHttpRequest;
xhr.open('get', './js/fastclick.js', true);
xhr.send();
xhr.onreadystatechange = function () {
	console.log(xhr.readyState); //=>2.3.4
}; */

/* let xhr = new XMLHttpRequest;
xhr.open('get', './js/fastclick.js', false);
xhr.send();
xhr.onreadystatechange = function () {
	console.log(xhr.readyState);
}; */

/* let xhr = new XMLHttpRequest;
xhr.open('get', './js/fastclick.js', false);
xhr.onreadystatechange = function () {
	console.log(xhr.readyState); //=>4
};
xhr.send(); */


function ajax(options) {
  let method = options.method || 'GET',
    params = options.params,
    data = options.data,
    url = options.url + (params ? '?' + Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&') : ''),
    async = options.async,
      success = options.success,
      headers = options.headers,
      xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

  xhr.open(method, url, async);
  if (headers) Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]));
  method === 'GET' ? xhr.send() : xhr.send(data);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) success && success(xhr.responseText);
  }
}

const ajax = options => {
  return new Promise((resolve, reject) => {
    let method = options.method || 'GET',
      params = options.params,
      data = options.data,
      url = options.url + (params ? '?' + Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&') : ''),
      async = options.async,
        headers = options.headers,
        xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          resolve(xhr.responseText);
        }
      }
    }
    xhr.open(method, url, async);
    if (headers) Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]));
    method === 'GET' ? xhr.send() : xhr.send(data);
  })
}