import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import React from 'react';
import { setContext } from '@apollo/client/link/context';

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client = {client}>
      <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Homepage} />
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/profile' component={Profile} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
        </Router>
   </ApolloProvider>
  );
}

export default App;
