import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

import Layout from '../components/Layout';
import { GetAllUsers } from '../types/GetAllUsers';

export const getAllUsers = gql`
query GetAllUsers {
  jotts_user {
    email
  }
}
`

class Index extends React.Component<{ [key: string]: any }> {
  public static async getInitialProps() {

    return {
    }
  }

  public render() {
    return (
      <Layout>
        <Query<GetAllUsers> query={getAllUsers}>
          {({ loading, error, data }) => {
            if (error) {
              return <div>{error}</div>
            }
            if (loading) {
              return <div>Loading...</div>
            }
            return data ? (
              data.jotts_user.map(e => (
                <li>{e.email}</li>
              ))
            ) : null
          }}
        </Query>
      </Layout>
    )
  }
}

export default Index