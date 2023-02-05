import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// import custom components
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
//import Footer from './components/Footer';

// import GlobalState Provider
import { MovieProvider } from "./utils/GlobalState";

// stylesheets
import './App.css';

const client = new ApolloClient({
    request: operation => {
        const token = localStorage.getItem('id_token');

        operation.setContext({
            headers: {
                authorization: token ? `Bearer ${token}` : ''
            }
        })
    },
    uri: '/graphql'
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <MovieProvider>
                    <div className="app-container">
                        <div className="app-content">
                            <Navbar />
                            <Switch>
                                <Route exact path='/' component={Homepage} />
                                <Route exact path='/Dashboard' component={Dashboard} />
                                <Route exact path='/Profile' component={Profile} />
                                <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
                            </Switch>
                        </div>
                    </div>
                    
                </MovieProvider>
            </Router>
        </ApolloProvider>
    );
}

export default App;