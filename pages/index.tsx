import gql from 'graphql-tag';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import React from 'react';
import { Query } from 'react-apollo';

import Layout from '../components/Layout';
import { GetAllUsers } from '../types/GetAllUsers';

export const getAllUsers = gql`
query GetAllUsers {
  user {
    id
    username
    email
    posts {
      tags {
        tag {
          slug
        }
      }
    }
  }
}
`

class Index extends React.Component<{ [key: string]: any }> {
  public static async getInitialProps() {
    const res = await fetch('https://api.tvmaze.com/search/shows?q=batman')
    const data = await res.json()

    console.log(`Show data fetched. Count: ${data.length}`)

    return {
      shows: data.map((entry: { show: any; }) => entry.show)
    }
  }

  public render() {
    return (
      <Layout>
        <h1>Batman TV Show</h1>
        <ul>
          {this.props.shows.map((show: any) => (
            <li key={show.id}>
              <Link as={`/p/${show.id}`} href={`/post?id=${show.id}`}>
                <a>{show.name}</a>
              </Link>
            </li>
          ))}
        </ul>
        <Query<GetAllUsers> query={getAllUsers}>
          {({ loading, error, data }) => {
            if (error) {
              return <div>{error}</div>
            }
            if (loading) {
              return <div>Loading...</div>
            }
            return data ? (
              data.user.map(e => (
                <li>{e.username} {e.posts.map(p => p.tags.map(t => t.tag.slug))}</li>
              ))
            ) : null
          }}
        </Query>
      </Layout>
    )
  }
}

export default Index