import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

import { User } from '../../interfaces';
import Layout from '../../components/Layout';
import ListDetail from '../../components/ListDetail';
import { userData } from '../../../db/user-data';

type Props = {
  item?: User
  errors?: string
}

export default class UserDetail extends React.Component<Props> {
  render() {
    const { item, errors } = this.props;

    if (errors) {
      return (
        <Layout title={'Error | '}>
          <p>
            <span style={{ color: 'red' }}>Error:</span> {errors}
          </p>
        </Layout>
      );
    }

    return (
      <Layout
        title={`${
          item ? item.name : 'User Detail'
        }`}
      >
        {item && <ListDetail item={item} />}
      </Layout>
    );
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the paths we want to pre-render based on users
  const paths = userData.map(user => ({
    params: { id: user.id.toString() },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = params?.id;
    const item = userData.find(data => data.id === Number(id));
    // By returning { props: item }, the StaticPropsDetail component
    // will receive `item` as a prop at build time
    return { props: { item } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
