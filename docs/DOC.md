# 全栈开发总结

Next.js version_9.0 之后新增的 api 路由以及参数路由极大程度上简化了项目的配置，绝大部分场景其实都并不需要进行 `Custom Server` 了。

## 后台服务

后台服务就是一个个 API 接口，在前台页面调用相应的 `/api/xxx` 路径即可。

### 一个小例子 🌰

- 前台页面: `pages/users/index.tsx`

```js
const UserPage = ({ users }: Props) => (
  <Layout title="Users List">
    <List items={users} />
  </Layout>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const resUsers = await request('http://localhost:3000/api/users');
  const users: User[] = resUsers.data;
  return { props: { users } };
};

export default UserPage;
```

- 接口服务: `pages/api/data/user.ts`

```js
import { NextApiRequest, NextApiResponse } from 'next';
import { userData } from '../../../utils/user-data';

export default (_: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!Array.isArray(userData)) {
      throw new Error('Cannot find user data');
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};
```

### 问题

如果是全栈，那么前后端都是在一个项目里去写，所以在进行服务端 `data fetching` 的时候需要注意，使用 `getServerSideProps` 而不是 `getStaticProps`，因为 `getStaticProps` 会在构建时也进行数据请求，而我们的开发环境 `API Host` 应该是 `http://localhost:port`，`build` 过程中并不能访问到数据，因此会出现错误，改成 `getServerSideProps` 即可。

如果不是全栈开发，那么接口地址应该是后台服务的，所以可以按照官方推荐的，尽量使用 `getStaticProps` 来进行数据获取。

## 不想全栈

这个项目只是基于自身的想法搭建的全栈项目，其实不一定必须全栈，只用来写前端也是非常方便的。
