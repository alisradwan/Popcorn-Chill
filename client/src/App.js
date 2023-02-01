import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import React from 'react';
import { setContext } from '@apollo/client/link/context';

import Navbar from "./components/Navbar";
import TopMovies from "./pages/topMovies";
import TrendingMovies from "./pages/trendingMovies";

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client = {client}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<TrendingMovies />} />
          <Route path="/SearchMovies" element={<TopMovies />} />
        </Routes>
      </BrowserRouter>
   </ApolloProvider>
  );
}

export default App;
