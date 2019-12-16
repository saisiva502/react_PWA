import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';

export default class RestaurantProfile extends Component {
	constructor(props){
		super(props);

		this.state = {
			dishes: [],
			btn_value: 'FOLLOW',
			isToast: false,
			followers_count: 0,
			is_fav: false,
			rating: '',
			votes: '',
			res_name: '',
			address: '',
			dish_up_id: '',
			update: false,
			dish_pro_id: '',
			profile_redirect: false,
			render_rating: false
		}

		this.handleResClose = this.handleResClose.bind(this);
		this.handleFollow = this.handleFollow.bind(this);
		this.handleFavouriteRestaurant = this.handleFavouriteRestaurant.bind(this);
		this.getRestaurantData = this.getRestaurantData.bind(this);
		this.handleDishProfile = this.handleDishProfile.bind(this);
		this.renderAddDish = this.renderAddDish.bind(this);
		this.renderDishProfile = this.renderDishProfile.bind(this);
		this.dishRating = this.dishRating.bind(this);
		this.renderRating = this.renderRating.bind(this)
	}

 notify = (data) => toast.info(data);

	handleFollow(){
		// console.log(this.props.location.state.id)
		var token = localStorage.getItem('token')
		if(this.state.btn_value === 'FOLLOW'){
			axios.post('https://foodfie.herokuapp.com/api/v1/restaurants/'+ this.props.location.state.id +'/follow','', {headers: { Authorization: token }}).then(res=>{
				// console.log("RES FOLLOW", res)
				this.setState({btn_value:'UN FOLLOW', isToast: true})
				this.notify("You are successfully following the restaurant")
			})
		}else{
			axios.post('https://foodfie.herokuapp.com/api/v1/restaurants/'+ this.props.location.state.id +'/unfollow','', {headers: { Authorization: token }}).then(res=>{
				// console.log("RES FOLLOW", res)
				this.setState({btn_value:'FOLLOW', isToast: true})
				this.notify("You are unfollowed the restaurant")
			})
		}
	}

	handleFavouriteRestaurant(){
		var token = localStorage.getItem('token')
		if(!this.state.is_fav){
			axios.post('https://foodfie.herokuapp.com/api/v1/restaurants/'+ this.props.location.state.id +'/favourite', '', {headers: { Authorization: token }}).then(res=>{
				 // console.log(res)
				 this.getRestaurantData()
			})
		}else{
			axios.post('https://foodfie.herokuapp.com/api/v1/restaurants/'+ this.props.location.state.id +'/unfavourite', '', {headers: { Authorization: token }}).then(res=>{
				// console.log(res)
				this.getRestaurantData()
			})
		}
	}

	dishRating(item){
		localStorage.setItem("rate_dish", item)
		this.setState({render_rating:true})
		console.log(this.state.render_rating, item)
	}

	handleDishProfile(dish){
		this.setState({dish_pro_id: dish, profile_redirect: true})
	}


	renderDishProfile(){
		if(this.state.profile_redirect){
			return <Redirect to={{ pathname: '/DishProfile', state: {dish: this.state.dish_pro_id, back_url: '/RestaurantProfile', res_data: this.props.location.state } }} />
		}
	}

	handleDishUpdate(id){
		// console.log(id)
		this.setState({dish_up_id: id, update: true})
	}

	renderRating(){
		if(this.state.render_rating){
			return <Redirect to={{pathname: '/Rating', state: {back_url: '/RestaurantProfile', res_data: this.props.location.state }}} />
		}
	}

	renderAddDish(){
		if(this.state.update){
			return <Redirect to={{ pathname: '/AddDish', state: {id: this.state.dish_up_id, res_data:this.props.location.state, back_url: "/RestaurantProfile"  } }} />
		}
	}

	getRestaurantData(){
		var token = localStorage.getItem('token')
		axios.get('https://foodfie.herokuapp.com/api/v1/restaurants/'+ this.props.location.state.id +'', {headers: { Authorization: token }}).then(res => {
      this.setState({address: res.data.restaurant.address ,res_name: res.data.restaurant.name,dishes: res.data.restaurant.dishes, rating: res.data.restaurant.rating, votes: res.data.restaurant.votes , is_fav:res.data.restaurant.favourited_by })
      // console.log(res)
      if(res.data.restaurant.followed_by){
      	this.setState({btn_value: 'UN FOLLOW' , followers_count:res.data.restaurant.followers_count})
      }
    })
  // console.log(this.props.location)
	}

	componentDidMount(){
		if(!localStorage.getItem('token')){
		  window.location.href = '/#/'
	  }
		// console.log(this.props.location.state.id)
		this.getRestaurantData()
		// console.log(this.state.dishes)
	}
	handleResClose(){
		// console.log("close", this.props.location)
		this.props.history.push(this.props.location.state.back_url)
	}

	render(){
		return(
			<div>
			 {this.renderAddDish()}
			 {this.renderDishProfile()}
			 {this.renderRating()}
			  <div className="res_block">
				  <img src='./images/add_dish.jpg' className="dish_image" width="100%" height="250px" alt="login" />
				  {
				  	this.state.is_fav ?
				    <img onClick={this.handleFavouriteRestaurant} src='./images/star_fav.png' className="plus_icon" width="30px" height="30px" alt="login" />
				    :
					  <i onClick={this.handleFavouriteRestaurant} className="plus_icon fa fa-star-o" ></i>
				  }
					<i onClick={this.handleResClose} className="back_icon fa fa-chevron-left"></i>
					<h2 className="dish_name">{this.state.res_name}</h2>
					<i className="heart_img fa fa-heart-o"></i>
					<p className="result_percentage">{this.state.rating}<small>%</small></p>
					<h3 className="restaurant_name"><b>{this.state.address}</b></h3>
					<h3 className="vote_count"><b>{this.state.votes} Votes</b></h3>


				</div>
			  <div className="res_follow_block">
			  	<p><i className="fa fa-users" aria-hidden="true"></i> {this.state.followers_count} FOLLOWERS</p>
			  	<button onClick={this.handleFollow} className="follow_btn">{this.state.btn_value}</button>
			  </div>

			  {
		    	this.state.isToast ? <ToastContainer /> : null
		    }

			  <div className="row">
			  	{
			  		this.state.dishes && this.state.dishes.length ?
			  		this.state.dishes.map((item, index)=>{
			  			return(
				  				<div className="res_dish_item col-md-6 col-lg-6 col-sm-6 col-xs-6" key={item.id}>
						  			<div>
						  				<div className="res_dish_img" onClick={()=>this.handleDishProfile(item.id)}>
						  				  {
						  				  	item.image ?
						  				      <img src={item.image.image_url} onError={(e)=>{e.target.onerror = null; e.target.src="./images/Indian-Food.jpg"}} className="dish_image" width="100%" height="200px" alt="login" />
						  				    :
						  				      <img src="./images/Indian-Food.jpg" onError={(e)=>{e.target.onerror = null; e.target.src="./images/Indian-Food.jpg"}} className="dish_image" width="100%" height="200px" alt="login" />
						  				  }
						  				</div>
						  				<img className="plus_icon" src="./images/plus_lite.png" onClick={()=>this.handleDishUpdate(item.id)} alt="add" />
						  				<img className="res_heart_img" src="./images/heart.png" alt="login" onClick={()=>this.dishRating(item.id)}/>
											{
												(item.average_rating === 0) ?
											  <p className="res_dish_percentage" onClick={()=>this.dishRating(item.id)}>10<small>%</small></p>
											  :
											  <p className="res_dish_percentage" onClick={()=>this.dishRating(item.id)}>{item.average_rating}<small>%</small></p>
											}
											<div className="res_dish_name">
							  				<p>{item.name}</p>
							  			</div>
						  			</div>
						  		</div>
			  			)
			  	  })
			  		: null
			  	}
			  </div>
			</div>
		)
	}
}