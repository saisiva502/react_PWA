import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


export default class DishProfile extends Component {
	constructor(props){
		super(props);
		this.state = {
			dish_data:'',
			dish_name: "",
			address: "",
			image: [],
			phone_number: '',
			comments: [],
			restaurant_name: '',
			favourited_by: false,
			average_rating: 0,
			id: '',
			rating: false,
			votes: 0,
			res_redirect: false
		}
		this.handleResClose = this.handleResClose.bind(this)
		this.handleDishFavourites = this.handleDishFavourites.bind(this)
		this.getDishData = this.getDishData.bind(this)
		this.handleRating = this.handleRating.bind(this)
		this.renderRestaurantProfile = this.renderRestaurantProfile.bind(this)
	}

	handleResClose(){


		if(this.props.location.state) {
  		if(this.props.location.state.res_data){
				this.setState({res_redirect: true})
  		}else{
        this.props.history.push(this.props.location.state.back_url);
  		}
  	}else{
      this.props.history.push('/Dishes');
  	}
		// if(this.props.location.state){
		// 	if(this.props.location.state.res_data){
		// 		this.setState({res_redirect: true})
		// 		// console.log("check")
		// 	}
		//   this.props.history.push(this.props.location.state.back_url)
		// }
		// this.props.history.push(this.props.location.state.back_url)
	}
 	componentDidMount(){
 		if(!localStorage.getItem('token')){
	    window.location.href = '/#/'
    }
    if(this.props.location.state){
			// console.log("State", this.props.location.state)
		}
	  this.getDishData()
 	}

 	renderRestaurantProfile(){
 		if(this.state.res_redirect){
 			return <Redirect to={{ pathname: '/RestaurantProfile', state: this.props.location.state.res_data }} />
 		}
 		// console.log(this.props.location.state.res_data)
 	}
 	handleRating(){
 		localStorage.setItem("rate_dish", this.state.id)
 		this.setState({rating: true})
 	}

 	renderRating(){
 		if(this.state.rating){
 			return <Redirect to={{ pathname: '/Rating', state: {back_url: '/DishProfile' } }} />
 		}
 	}

 	getDishData(){
 		var dish = this.props.location.state.dish;
 		// console.log("FFFFFFFF", this.state.dish_data)
 		var token = localStorage.getItem("token")
    axios.get('https://foodfie.herokuapp.com/api/v1/dishes/'+ dish +'', {headers: { Authorization: token }}).then(res => {
	    this.setState({votes: res.data.dish.votes,id: res.data.dish.id,average_rating: res.data.dish.average_rating, restaurant_name: res.data.dish.restaurant_name.toUpperCase(),phone_number: res.data.dish.restaurant.phone_number, dish_data: res.data.dish, address: res.data.dish.restaurant.address, image: res.data.dish.images[0], comments: res.data.dish.comments, favourited_by: res.data.dish.favourited_by})
	    console.log("Restaurant Satte", res)
    })
 	}

 	handleDishFavourites(){
 		var dish = this.props.location.state.dish;
 		var token = localStorage.getItem("token")
 		if(this.state.favourited_by){
 			axios.post('https://foodfie.herokuapp.com/api/v1/dishes/'+ dish +'/unfavourite', '', {headers: {Authorization: token }}).then(res=>{
 				// console.log(res)
	      this.getDishData()
 			})
 		}else{
 			axios.post('https://foodfie.herokuapp.com/api/v1/dishes/'+ dish +'/favourite', '', {headers: {Authorization: token }}).then(res=>{
	      this.getDishData()
 				// console.log(res)
 			})
 		}
 	}

	render(){
		return(
			<div className="main_div">
			  <div className="row">
			  { this.renderRating()}
			  {this.renderRestaurantProfile()}
			  	<div className="col-md-12 col-lg-12 col-xs-12">
						<div className="result_img_profile">
						 {
						 	this.state.image ?
				      <img src={this.state.image.image_url} onError={(e)=>{e.target.onerror = null; e.target.src="./images/Indian-Food.jpg"}} className="dish_image" width="100%" height="250px" alt="login" />
						 	:
				      <img src="./images/Indian-Food.jpg" onError={(e)=>{e.target.onerror = null; e.target.src="./images/Indian-Food.jpg"}} className="dish_image" width="100%" height="250px" alt="login" />
						 }
				      <h2 className="dish_name">{ this.state.dish_data.name}</h2>
							<i className="heart_img fa fa-heart-o"></i>
							<p className="result_percentage" onClick={this.handleRating}>{ ( this.state.average_rating === 0 ) ? 10 : this.state.average_rating }<small>%</small></p>
							<i onClick={this.handleResClose} className="back_icon fa fa-chevron-left"></i>
							<h3 className="restaurant_name"><b>{this.state.restaurant_name}</b></h3>
							<h3 className="vote_count"><b>{this.state.votes} Votes</b></h3>
							{
								this.state.favourited_by ?
				        <img onClick={this.handleDishFavourites} src='./images/star_fav.png' className="plus_icon" width="30px" height="30px" alt="login" />
				        :
							  <i onClick={this.handleDishFavourites} className="plus_icon fa fa-star-o" ></i>
							}
					  </div>
					  <div className="location_bar">
				      <p className="dish_location_style">
				      	<span>
				      		<i className="fa fa-map-marker" aria-hidden="true"></i>
				      	</span>{this.state.address}
				      </p>
				      <a href={"tel:+"+ this.state.phone_number}>
					      <p className="dish_contact">
						      	<span>
						      		<i className="call_icon fa fa-phone fa-rotate-270"></i>
						      	</span>CALL
					      </p>
				      </a>
						</div>
			  	</div>
			  </div>
			  <div className="desc_block">
					<div className="desc_align">
						<p className="desc_info">Greek yoghurt or hung curd, onion, tomato, milk, saffron and a melange of whole and ground spices.</p>
					</div>
				</div>
			  <h1 className="comments_block">COMMENTS</h1>
			  <div className="user_comments">
			  	{
			  	this.state.comments && this.state.comments.length>0 ?
			  		this.state.comments.map((item, index)=>{
			  			return(
			  				<div>
			  					<div className="comment">
			  						<div className="map_dishes_list">
											<img src="./images/login_bg.jpg" className="rounded-circle" alt="Restaurant Logo" width="60" height="60" />
											<p className="map_dishes_dish_name">{item.user.name}</p>
											<p className="map_dishes_res_name">{item.comment}</p>
											<img className="map_dishes_heart_img" width="30" height="30" 
											src="./images/heart.png" alt="login" />
											<span className="map_dishes_rating">{item.user.rating}%</span>
										</div>
			  					</div>
			  				</div>
			  			)
			  	  }):
			  	  <p>No Comments for this Item</p>
			  	}
			  </div>
			</div>
		)
	}
}