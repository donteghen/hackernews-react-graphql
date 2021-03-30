import React from 'react';
import ReactDOM from 'react-dom';
import '../src/styles/index.css';
import App from '../src/components/App.js';
import reportWebVitals from './reportWebVitals';
import {ApolloProvider, ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import { setContext } from '@apollo/client/link/context'
import {BrowserRouter as Router} from 'react-router-dom';
import { AUTH_TOKEN } from './constants';

// 2
const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
  headers:{
    
  }
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// 4
ReactDOM.render(
  <Router>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
