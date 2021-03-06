import React from 'react';
import Link from './Link';
import {useQuery, gql} from '@apollo/client';
import { LINKS_PER_PAGE } from '../constants';
import { useHistory } from 'react-router';

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
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
      user {
        id
      }
    }
  }
`;
const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
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
`;
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
const getQueryVariables = (isNewPage, page) => {
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE: 0;
  const take = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = { createdAt: 'desc' };
  return { take, skip, orderBy };
};
const LinkList = () => {
  const history = useHistory()
  const isNewPage = history.location.pathname.includes('new');
  const pageIndexParams = history.location.pathname.split('/');
  const page = parseInt(pageIndexParams[pageIndexParams.length - 1]);

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  const {data, loading, error, subscribeToMore} = useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page)
  });
  // subscribeToMore({
  //   document: NEW_VOTES_SUBSCRIPTION
  // });
  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(
        ({ id }) => id === newLink.id
      );
      if (exists) return prev;
  
      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      });
    }
  });
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