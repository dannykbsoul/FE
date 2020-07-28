//利用script跨域的特性
function jsonp({
  url,
  params,
  cb
}) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    window[cb] = function (data) {
      resolve(data);
      document.body.removeChild(script);
    }
    params = {
      ...params,
      cb
    };
    script.src = `${url}?${Object.keys(params).map(key=>key+"="+params[key]).join('&')}`;
    document.body.appendChild(script);
  })
}

jsonp({
  url: 'http: //domain:port/testJSONP',
  params: {
    a: 1,
    b: 2
  },
  cb: 'foo'
}).then(data => {
  console.log(data);
})

//缺点：1.只能是get请求 2.不安全