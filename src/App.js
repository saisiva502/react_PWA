import React from 'react';
import './App.css';
import Main from './components/Main';
import Search from './components/Search';
import Result from './components/Result';
import DishProfile from './components/DishProfile';
import RestaurantProfile from './components/RestaurantProfile';
import Filter from './components/Filter';
import Rating from './components/Rating';
import AddDish from './components/AddDish';
import Followers from './components/Followers';
import Profile from './components/Profile';
import Favorites from './components/Favorites';
import GoogleMaps from './components/GoogleMaps';
import { Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
  	<BrowserRouter>
	    <div className="App">
	      <Route exact path="/" component={Main}/>
	      <Route exact path="/DishProfile" component={DishProfile}/>
	      <Route exact path="/Search" component={Search}/>
	      <Route exact path="/Dishes" component={Result}/>
	      <Route exact path="/Filter" component={Filter}/>
	      <Route exact path="/Rating" component={Rating}/>
	      <Route exact path="/Followers" component={Followers}/>
	      <Route exact path="/MyProfile" component={Profile}/>
	      <Route exact path="/MyFavorites" component={Favorites}/>
	      <Route exact path="/AddDish" component={AddDish}/>
	      <Route exact path="/RestaurantProfile" component={RestaurantProfile}/>
	      <Route exact path="/GoogleMaps" component={GoogleMaps}/>
	    </div>
    </BrowserRouter>
  );
}

export default App;
