import React from 'react';
import Link from './Link';
import {useQuery, gql} from '@apollo/client';

export const FEED_QUERY = gql`
query getAllFeeds{
  feed {
      id
      links {
        id
        createdAt
        url
        description
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

const LinkList = () => {
  const {loading, error, data} = useQuery(FEED_QUERY, {onError:(error)=>{
    
  }});
  if(loading) return <h1>Loading data...............</h1>
  if(error) return <h1>error</h1>
  return (
          <div>
            {data && 
            (<>
            {data.feed.links.map((link, index) => (
              <Link key={link.id} link={link} index={index} />
            ))}
            </>)}
          </div>
  );
};

export default LinkList;