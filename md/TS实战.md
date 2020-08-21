---
title: TS实战
date: 2020-03-01 15:38:44
tags:
categories: [express,TypeScript]
---



## react

npx create-react-app react-project --template typescript --use-npm





<!---more-->









## express



### 1.编写express代码遇到的问题



**Q1:express库的类型定义文件.d.ts文件类型描述不准确**

不能直接在express官方提供的.d.ts上修改，因为你下次再npm的时候，下载的还是官方提供的文件。

可以通过引入官方的相对应的描述文件，在其之上修正描述不准确的地方，如下所示：

<!---more-->

~~~TS
import { Router, Request, Response } from 'express';

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const router = Router();
router.get('/', (req, res) => {
  res.send(`
  <html>
    <body>
      <form method="post" action="/getData">
        <input type="password" name="password">
        <button>提交</button>
      </form>
    </body>
  </html>
  `);
});

router.post('/getData', (req: RequestWithBody, res: Response) => {
  if (req.body.password === '123') {
    const secret = 'secretKey';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = DellAnalyzer.getInstance();
    new Crowller(url, analyzer);
    res.send('getData Success');
  } else {
    res.send(`${req.teacherName}password error`);
  }
});

export default router;
~~~



Q2:当我使用中间件的时候，对req、res进行修改之后，实际上类型并不能改变，即类型无法拓展。

可以自定义一个.d.ts文件，仿照官方的描述文件，把需要拓展的内容加上。这样通过类型融合的方式，可以对req、res的类型进行拓展。

~~~TS
declare namespace Express {
  interface Request {
    myName: string;
  }
}
~~~

~~~TS
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import router from './router';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req: Request, res: Response, next: NextFunction) => {
  req.myName = 'zhou';
  next();
});
app.use(router);

app.listen(7001, () => {
  console.log('server is running');
});
~~~



### 2.登陆功能实现

服务端持久存储，需要用到cookie-session

index.ts

~~~TS
import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import router from './router';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['teacher zhou'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);
app.use(router);

app.listen(7001, () => {
  console.log('server is running');
});

~~~



~~~TS
import { Router, Request, Response, NextFunction } from 'express';
import Crowller from './utils/crowller';
import DellAnalyzer from './utils/analyzer';
import fs from 'fs';
import path from 'path';

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.send('请先登陆');
  }
}; //业务逻辑中间件

const router = Router();

router.get('/', (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(`
  <html>
    <body>
      <a href='/getData'>爬取内容</a>
      <a href='/showData'>展示内容</a>
      <a href='/logout'>退出</a>
    </body>
  </html>
  `);
  } else {
    res.send(`
  <html>
    <body>
      <form method="post" action="/login">
        <input type="password" name="password">
        <button>登陆</button>
      </form>
    </body>
  </html>
  `);
  }
});

router.get('/logout', (req: BodyRequest, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.redirect('/');
});

router.post('/login', (req: BodyRequest, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send('已经登陆');
  } else {
    if (password === '123' && req.session) {
      req.session.login = true; //if语句进行类型保护
      res.send('登陆成功');
    } else {
      res.send('登陆失败');
    }
  }
});

router.get('/getData', checkLogin, (req: BodyRequest, res: Response) => {
  const secret = 'secretKey';
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
  const analyzer = DellAnalyzer.getInstance();
  new Crowller(url, analyzer);
  res.send('getData Success');
});

router.get('/showData', checkLogin, (req: BodyRequest, res: Response) => {
  try {
    const position = path.resolve(__dirname, '../data/course.json');
    const result = fs.readFileSync(position, 'utf-8');
    res.json(JSON.parse(result));
  } catch (error) {
    res.send('尚未爬取到内容');
  }
});

export default router;
~~~



### 3.用装饰器优化express代码

