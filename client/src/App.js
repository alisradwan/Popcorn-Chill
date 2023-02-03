import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import React from "react";
import { setContext } from "@apollo/client/link/context";
import Trindingmoves from "./pages/Movies/trindingmoves";
import TvShows from "./pages/TvShows/TvShows";
import PopularPeople from "./pages/People/PopularPeople";
import UpComing from "./pages/Movies/UpComing";
import NowPlaying from "./pages/Movies/NowPlaying";
import TopRelated from "./pages/Movies/TopRelated";
import AiringToday from "./pages/TvShows/AiringToday";
import TopRelatedShow from "./pages/TvShows/TopRelatedShow";
import OnTV from "./pages/TvShows/OnTV";

import { MovieProvider } from "./utils/MovieContext";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <MovieProvider>
          <Navbar />
          <Switch>
            <Route exact path="/PopularPeople" component={PopularPeople} />
            <Route exact path="/OnTV" component={OnTV} />
            <Route exact path="/UpComingMovies" component={UpComing} />
            <Route exact path="/NowPlayingMovies" component={NowPlaying} />
            <Route exact path="/TopRelatedMovies" component={TopRelated} />
            <Route exact path="/TopRelatedShow" component={TopRelatedShow} />
            <Route exact path="/AiringToday" component={AiringToday} />
            <Route exact path="/TvShows" component={TvShows} />
            <Route exact path="/PopularMovies" component={Trindingmoves} />
            <Route exact path="/" component={Homepage} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/profile" component={Profile} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </MovieProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;
