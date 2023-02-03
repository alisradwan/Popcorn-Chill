
import './App.css';
import React from 'react';
import Home from './components/Home.js'
import Footer from './components/Footer.js'
// import videoBg from '..assets/videoBg.mp4'
// import VideoTp from '..assets/VideoTp.mp4'
// import VideoMd from '..assets/VideoMd.mp4'

import { BrowserRouter as Router, Route } from 
'react-router-dom';

function App() {
  return (
  <>
    <Home/>
    <Footer/>
  </>
    
  );
}

export default App;
