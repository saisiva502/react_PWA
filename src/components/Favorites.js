import React, { Component } from 'react';
import axios from 'axios';
import DragScrollProvider from 'drag-scroll-provider';
import RestaurantList from './RestaurantList';
import { Redirect } from 'react-router-dom';

export default class Favorites extends Component {
	constructor(props){
		super(props);
		this.state = {
			restaurants: [],
			dishes:[],
			rating: false,
			dish: '',
			redirect: false,
			res:'',
			res_redirect: false,
			spinner: true,
			dish_up_id: '',
		  update: false

		}
		this.handleDish = this.handleDish.bind(this)
		this.handleRestaurant = this.handleRestaurant.bind(this)
		this.handleRestaurantRedirect = this.handleRestaurantRedirect.bind(this)
		this.handleFavoritesClose = this.handleFavoritesClose.bind(this)
		this.renderAddDish =  this.renderAddDish.bind(this)
		this.handleUpdateDish = this.handleUpdateDish.bind(this)
		this.dishRating = this.dishRating.bind(this)
	}

	componentDidMount(){
		if(!localStorage.getItem('token')){
		  window.location.href = '/#/'
	    }
		var token = localStorage.getItem('token')
		axios.get('https://foodfie.herokuapp.com/api/v1/users/favourited_restaurants', {headers:{ Authorization: token}}).then(res =>{
			this.setState({restaurants: res.data.restaurants });
			// console.log(res.data.restaurants)
		})
		axios.get('https://foodfie.herokuapp.com/api/v1/users/favourited_dishes', {headers:{ Authorization: token}}).then(res =>{
			this.setState({dishes: res.data.dishes });
		})
	}

	dishRating(item){
		localStorage.setItem("rate_dish", item.id)
		this.setState({rating:true})
		// console.log(item)
	}

	handleUpdateDish(e){
		// console.log(e)
		this.setState({dish_up_id: e, update: true})
	}

	renderAddDish(){
		if(this.state.update){
			return <Redirect to={{ pathname: '/AddDish', state: {id: this.state.dish_up_id, back_url: '/MyFavorites' } }} />
		}
	}

	handleDish(e){
    this.setState({ dish: e, redirect: true})
	}
	ratingRedirect(){
		if(this.state.rating){
			 return <Redirect to={{ pathname: '/Rating' , state:{ back_url: '/MyFavorites'} }} />
		}
	}
	renderRedirect(){
    if (this.state.redirect) {
      return <Redirect to={{ pathname: '/DishProfile', state: {dish: this.state.dish, back_url: '/MyFavorites' } }} />
    }
  }

  handleRestaurant(e){
		this.setState({res: e, res_redirect: true})
	}

	handleRestaurantRedirect(){
		if (this.state.res_redirect) {
      return <Redirect to={{ pathname: '/RestaurantProfile', state: {id: this.state.res, back_url: '/MyFavorites' } }} />
    }
	}

	handleFavoritesClose(){
		this.props.history.push('/Search')
	}

	render(){
		return(
			<div className="main_div">
				<div className="result_nav">
			 		<div className="result_back">
			 			<p onClick={this.handleFavoritesClose}><i className="fa fa-chevron-left"></i> FAVORITES </p>
			 		</div>
			 	</div>
			  {this.renderAddDish()}
			 	{this.renderRedirect()}
			  { this.ratingRedirect()}
			  {this.handleRestaurantRedirect()}
			 	<p className="rest_header">RESTAURANTS</p>
					<DragScrollProvider>
				    {
				    	({ onMouseDown, ref }) => (
				      <div className="rest_block" onMouseDown={onMouseDown} ref={ref} >
								{

									this.state.restaurants && this.state.restaurants.length ?
									this.state.restaurants.map((item, index)=>{
										return(
											<div key={item.id} className="rest_div" onClick={()=>this.handleRestaurant(item.id)}>
												<div className="test">
													<img src="./images/login_bg.jpg" className="rounded-circle" alt="Restaurant Logo" width="35" height="35" />
													<p>{item.name}</p>
													<img className="rest_heart" src="./images/heart.png" alt="login" width="15px" height="15px" />
													{
														( item.rating === 0 ) ?
														<p className="rest_percentage">10<small>%</small></p>														
														:
														<p className="rest_percentage">{item.rating}<small>%</small></p>
													}
													<p className="rest_add">{item.city}</p>
												</div>
												<div className="rest_phn">
													<p className="rest_contact">
										      	<span>
										      		<i className="fa fa-phone fa-rotate-270"></i>
										      	</span>{item.phone_number}
										      </p>
												</div>
											</div>
										)
									})

									:

									"No favourite restaurants for You!!!"
								}
							</div>
				    )
				  }
				</DragScrollProvider>
				<p className="dishes_ind">DISHES</p>
				<RestaurantList spinner= {this.state.spinner} updateDish={this.handleUpdateDish} restaurants={this.state.dishes} onRating={this.dishRating} onClick={this.handleDish} />
		  </div>
		)
	}
}