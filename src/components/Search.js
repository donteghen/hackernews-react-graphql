import React, { useState } from 'react';
import { useLazyQuery , gql} from '@apollo/client';
//import gql from 'graphql-tag';
import Link from './Link';
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});
const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      id
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const Search = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [executeSearch, {loading, error,data}] = useLazyQuery(FEED_SEARCH_QUERY, {
    errorPolicy: 'all',
     errorLink
  });

  if (loading) return <h1>Loading ...</h1>;
  
//   if(error) {
//     if(error.graphQLErrors) return (<pre>Bad: {error.graphQLErrors.map(({ message }, i) => (
//         <span key={i}>{message}</span>
//       ))}
//       </pre>)
//      else if (error.graphQLErrors)return <span>Error : {error.networkError.message}</span>
//     }                 
  return (
    <>
      <div>
        Search
        <input
          type="text"
          onChange={(e) => setSearchFilter({searchFilter: e.target.value})}
        />
        <button onClick={() => executeSearch({variables:{filter : searchFilter}})}>OK</button>
      </div>
      {data &&
        data.feed.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
    </>
  );
};

export default Search;