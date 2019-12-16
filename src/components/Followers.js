import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
export default class Followers extends  Component {
	constructor(props){
		super(props);
		this.state = {
			color: '#f7aa97',
			restaurants: [],
			users: [],
			follow_state: 0,
			search_name: '',
			rest_followers_count: [],
			search_users: [],
			search_restaurants: [],
			search: false
		}

		this.selectFollowing = this.selectFollowing.bind(this)
	  this.followSelection = this.followSelection.bind(this)
	  this.searchData = this.searchData.bind(this)
	  this.handleClose = this.handleClose.bind(this)

	}

	selectFollowing(e){
		// var token = localStorage.getItem('token')
		if(e){
			this.getRestaurantsData()
		}else{
			this.getUsersData()
		}
  }

  followSelection = (e) => {
  	if (this.state.follow_state){
  		let check = e.target.checked;
		  var token = localStorage.getItem('token')
	  	if(check){
	  		axios.post('https://foodfie.herokuapp.com/api/v1/restaurants/'+ e.target.id +'/follow','', {headers: { Authorization: token }}).then(res=>{
					this.getRestaurantsData()
			  })
	  	}else{
	  		axios.post('https://foodfie.herokuapp.com/api/v1/restaurants/'+ e.target.id +'/unfollow','', {headers: { Authorization: token }}).then(res=>{
					this.getRestaurantsData()
			  })
	  	}
  	}else{
  		let check = e.target.checked;
		  let token = localStorage.getItem('token')
	  	if(check){
	  		axios.post('https://foodfie.herokuapp.com/api/v1/users/'+ e.target.id+'/follow','',{headers: {Authorization: token}}).then(res=>{
	  			// console.log(res)
	  			this.getUsersData()
	  		})
	  	}else{
	  		axios.post('https://foodfie.herokuapp.com/api/v1/users/'+ e.target.id+'/unfollow','',{headers: {Authorization: token}}).then(res=>{
	  			// console.log(res)
	  			this.getUsersData()
	  		})
	  	}
  	}
	}

	searchData = (e) => {
	  var token = localStorage.getItem('token')
		this.setState({search_name: e.target.value})
		if(this.state.search_name.length > 3 ){
			if(this.state.follow_state){
				axios.get('https://foodfie.herokuapp.com/api/v1/restaurants/search',{params:{search:this.state.search_name}, headers: {Authorization: token}}).then(res=>{
			    this.setState({search_restaurants: res.data.restaurants, search: true})
			    // console.log(res)
		    })
			}else{
				axios.get('https://foodfie.herokuapp.com/api/v1/users/search',{params:{search:this.state.search_name}, headers: {Authorization: token}}).then(res=>{
	  			this.setState({search_users: res.data.users, search: true})
	  		})
			}
		}else{
			this.setState({search: false})
		}
	}

getRestaurantsData(){
		// console.log("RESTAURANTS")
		var token = localStorage.getItem('token')
		this.setState({ follow_state: 1})
		axios.get('https://foodfie.herokuapp.com/api/v1/users/followed_restaurants', {headers: { Authorization: token }}).then(res=>{
			this.setState({restaurants: res.data.restaurants})
			// console.log(res)
		})
			// console.log(this.state.restaurants)
	}

	handleClose(){
		this.props.history.push('/Search')
	}

	getUsersData(){
		var token = localStorage.getItem('token')
  	this.setState({ follow_state: 0})
		axios.get('https://foodfie.herokuapp.com/api/v1/users', {headers: {Authorization: token}}).then(res=>{
			this.setState({users: res.data.users})
			// console.log(res)
		})
	}
  componentDidMount(){
  	if(!localStorage.getItem('token')){
		  window.location.href = '/#/'
	  }
		this.getUsersData()
  }

	render(){
		return(
			<div className="main_div">
				<div className="result_nav">
			 		<div className="result_back">
			 			<p onClick={this.handleClose} className="header_back_name"><i className="fa fa-chevron-left"></i> FOLLOWING </p>
			 		</div>
			 	</div>
			 	<div className="follow_search">
			 		<input id="follow_search_input" type="text" name="search" onChange={this.searchData} placeholder="Search username or email" />
			 		<i class="fa fa-search" aria-hidden="true"></i>
			 	</div>
			 	<div className="row">
			 		<div className="follower_toggle_block col-md-6 col-lg-6 col-sm-6 col-lg-6 col-xs-6">
					  <p onClick={()=>this.selectFollowing(0)} className="follow_ppl">PEOPLE</p>
					  <p onClick={()=>this.selectFollowing(1)} className="follow_res">RESTAURANTS</p>
			 		</div>
			 	</div>
			 	{
			 		this.state.follow_state ?
			 			this.state.search ?
				 			this.state.search_restaurants && this.state.search_restaurants.length ?
						 		this.state.search_restaurants.map((item, index)=>{
						 			return(
							 			<div className="follow_results_block">
							 				<div className="map_dishes_list">
												<img src="./images/login_bg.jpg" className="rounded-circle" alt="Restaurant Logo" width="60" height="60" />
												<p className="map_dishes_dish_name">{item.name}</p>
												<p className="map_dishes_res_name">{item.followers} Followers</p>
										 		<div className="fav_check">
											 		<label className="container">
													  <input id={item.id} checked={item.followed_by} onClick={this.followSelection} type="checkbox" />
													  <span className="checkmark"></span>
													</label>
								        </div>
											</div>
							 			</div>
							 		)
						 	  }) : "NO RESTAURANTS FOUND"

					 	  :

					 		this.state.restaurants && this.state.restaurants.length ?
					 		this.state.restaurants.map((item, index)=>{
					 			return(
						 			<div className="follow_results_block">
						 				<div className="map_dishes_list">
											<img src="./images/login_bg.jpg" className="rounded-circle" alt="Restaurant Logo" width="60" height="60" />
											<p className="map_dishes_dish_name">{item.name}</p>
											<p className="map_dishes_res_name">{item.followers} Followers</p>
									 		<div className="fav_check">
										 		<label className="container">
												  <input id={item.id} checked={item.followed_by} onClick={this.followSelection} type="checkbox" />
												  <span className="checkmark"></span>
												</label>
							        </div>
										</div>
						 			</div>
						 		)
					 	  }) : null
			 	  :
			 	  	this.state.search ?
				 	  	this.state.search_users && this.state.search_users.length ?
					 		this.state.search_users.map((item, index)=>{
					 			return(
						 			<div className="follow_results_block">
						 				<div className="map_dishes_list">
											<img src="./images/login_bg.jpg" className="rounded-circle" alt="Restaurant Logo" width="60" height="60" />
											<p className="map_dishes_dish_name">{item.username}</p>
											<p className="map_dishes_res_name">{item.followers} Followers</p>
									 		<div className="fav_check">
										 		<label className="container">
												  <input type="checkbox" checked={item.following} id={item.id} onClick={this.followSelection} />
												  <span className="checkmark"></span>
												</label>
							        </div>
										</div>
						 			</div>
						 		)
					 	  }): 'NO USERS FOUND'

				 	  :
				 	  this.state.users && this.state.users.length ?
				 		this.state.users.map((item, index)=>{
				 			return(
					 			<div className="follow_results_block">
					 				<div className="map_dishes_list">
										<img src="./images/login_bg.jpg" className="rounded-circle" alt="Restaurant Logo" width="60" height="60" />
										<p className="map_dishes_dish_name">{item.username}</p>
										<p className="map_dishes_res_name">{item.followers} Followers</p>
								 		<div className="fav_check">
									 		<label className="container">
											  <input type="checkbox" checked={item.following} id={item.id} onClick={this.followSelection} />
											  <span className="checkmark"></span>
											</label>
						        </div>
									</div>
					 			</div>
					 		)
				 	  }) : null
			 	}
			</div>
		)
	}

}