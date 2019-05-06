import { ApolloClient } from 'apollo-boost';
import gql from 'graphql-tag';
import { debounce } from 'lodash';
import React from 'react';
import { ApolloConsumer, Query } from 'react-apollo';

import {
  GetTagSuggestions, GetTagSuggestionsVariables
} from '../../apollo-types/GetTagSuggestions';
import { GetTopTags } from '../../apollo-types/GetTopTags';
import MaterialReactSelect from '../MaterialReactSelect';

const getTopTags = gql`
query GetTopTags {
    jotts_tag_post_count_view(limit:100, order_by:{post_count:desc_nulls_last}) {
    tag
    post_count
  }
}
`

const getTagSuggestions = gql`
query GetTagSuggestions($query: String!){
  jotts_tag_post_count_view(limit: 20, order_by:{post_count: desc_nulls_last}, where:{tag:{_similar:$query}}) {
    tag
  }
}
`

const debouncedFetch = debounce((input, callback, client: ApolloClient<any>) => {
    client.query<GetTagSuggestions, GetTagSuggestionsVariables>({
        query: getTagSuggestions,
        variables: {
            query: `%${input}%`
        }
    }).then(response => {
        callback(response.data.jotts_tag_post_count_view.map(t => t.tag ? t.tag : '').filter(t => t))
    })
}, 250)

interface ComponentProps {
    onChange?: (selected: string[]) => void,
    defaultSelected?: string[]
}
type Props = ComponentProps

export default class SelectTags extends React.Component<Props> {
    public render() {
        return (
            <ApolloConsumer>
                {client => (
                    <Query<GetTopTags> query={getTopTags}>
                        {({ loading, error, data }) => {
                            if (error) {
                                return <div>{error.message}</div>
                            }
                            if (loading) {
                                return <div>Loading...</div>
                            }
                            return data ? (
                                <MaterialReactSelect
                                    options={data.jotts_tag_post_count_view.map(t => t.tag ? t.tag : '').filter(t => t)}
                                    loadOptions={(input, callback) => {
                                        debouncedFetch(input, callback, client)
                                    }}
                                    onChange={this.props.onChange || (() => void 0)}
                                    defaultSelected={this.props.defaultSelected || []}
                                />
                            ) : null
                        }}
                    </Query>
                )}
            </ApolloConsumer>
        )
    }
}