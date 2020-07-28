var ws = new WebSocket('wss://echo.websocket.org');

//请求发送出去
ws.onopen = function (evt) {
  console.log('Connection open ...');
  ws.send('Hello WebSockets!');
};

//接受请求
ws.onmessage = function (evt) {
  console.log('Received Message: ', evt.data);
  ws.close();
};

//监听关闭
ws.onclose = function (evt) {
  console.log('Connection closed.');
};