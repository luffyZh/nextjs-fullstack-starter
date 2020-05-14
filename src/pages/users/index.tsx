import { GetServerSideProps } from 'next';
import Link from 'next/link';
import request from '../../utils/request';

import { User } from '../../interfaces';
import Layout from '../../components/Layout';
import List from '../../components/List';

import style from './index.module.scss';

type Props = {
  users: User[];
};

const UserPage = ({ users }: Props) => (
  <Layout title="Users List | Next.js + TypeScript Example">
    <h1>Users List</h1>
    <p className={style.p_text}>
      Example fetching data from inside <code>getServerSideProps()</code>.
    </p>
    <p>You are currently on: /users</p>
    <List items={users} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const resData = await request.get('/api/users');
  const users: User[] = resData;
  return { props: { users } };
};

export default UserPage;
