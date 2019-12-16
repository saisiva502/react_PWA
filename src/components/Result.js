import React, { Component } from 'react';
import RestaurantList from './RestaurantList';
import { Redirect, Link } from 'react-router-dom';
import DragScrollProvider from 'drag-scroll-provider';
import axios from 'axios';
import { Store, set } from 'idb-keyval';
import { Range } from 'rc-slider';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Result extends Component {
	constructor(props){
		super(props);
		this.state = {
			data :[],
			results: [],
			search: "",
			redirect: false,
			filter: false,
			dish: "",
			rating: false,
			maps: false,
			result: false,
		  min: 0,
		  max: 1000,
		  sort_by: '',
		  rating_by: '',
		  meals: [],
		  dietarien: [],
		  favorites: false,
		  result_data: [],
		  isToast: false,
		  res_redirect: false,
		  res: 0,
		  dish_page: 1,
		  dish_up_id: '',
		  update: false
	  }
	  this.handleDish = this.handleDish.bind(this)
		this.goBack = this.goBack.bind(this)
		this.mapsHandle = this.mapsHandle.bind(this)
		this.dishRating = this.dishRating.bind(this)
		this.handleRestaurant = this.handleRestaurant.bind(this)
		this.onSliderChange = this.onSliderChange.bind(this)
		this.handleSort = this.handleSort.bind(this)
		this.handleRating = this.handleRating.bind(this)
		this.handleFavourite = this.handleFavourite.bind(this)
		this.handleMeal = this.handleMeal.bind(this)
		this.filterClose = this.filterClose.bind(this)
		this.handleDietarian = this.handleDietarian.bind(this)
		this.getRestaurantDishesData = this.getRestaurantDishesData.bind(this)
		this.renderAddDish =  this.renderAddDish.bind(this)
		this.handleUpdateDish = this.handleUpdateDish.bind(this)
	}

	componentDidMount = () => {
		// if(!localStorage.getItem('token')){
		//   window.location.href = '/#/'
	 //  }
	 // 	var dish = localStorage.getItem("dish")
		// this.setState({search: dish})
		// // var token = localStorage.getItem("token")
		// // console.log("TOKEN", token)
		// axios.get('http://203.193.173.125:6325/api/v1/search', {params:{search: dish, dish_limit: 10, dish_page: 1, location: "Kakinada, East"}}).then(res => {
  //    	console.log("@@@@@@@@@@@@@@@@@@@@", res)

  //    	if(res.data.dishes.length){
	 //   		this.setState({results:res.data.dishes })
	 //   		this.setState({data:res.data.dishes })
	 //   		this.setState({dish_page: this.state.dish_page + 1 })
	 //   		console.log("results", this.state.results)
	 //   		const customStore = new Store('posts-store', 'DISHES');
		// 	 	set('dish_rate', res.data.dishes, customStore)
	 //   		// console.log("@@@@@@@@@@@@@@@@@@@@", this.state.data)
	 //   		return res.data.dishes[0];
  //  	  }else{
  //  	  	this.setState({isToast: true})
  //  	  	this.notify("Searched Dishes are not available")
  //  	  	setTimeout(function() {
  //  	  		window.location.href = '/'
  //  	  	}, 3000)
  //  	  }
  //   })
    // .then(res =>{
    // 	console.log("{{{{{{{{{{{{{{{{{", res)
    // 	axios.get('https://foodfie.herokuapp.com/api/v1/restaurants/'+ res.restaurant_id +'', {headers: { authorization: token }}).then(res => {
	   //    this.setState({results: res.data.restaurant.dishes})
	   //    console.log("First Restaurant", this.state.results)
	   //  });
    // })
    this.getRestaurantDishesData()
	}



	getRestaurantDishesData(){
		if(!localStorage.getItem('token')){
		  window.location.href = '/#/'
	  }
	 	var dish = localStorage.getItem("dish")
		this.setState({search: dish})
		// var token = localStorage.getItem("token")
		// console.log("TOKEN", token)

		// var dish_page = this.state.dish_page + 1;
		// console.log("dish_page", dish_page)
		// console.log("state", this.state.dish_page)
		axios.get('https://foodfie.herokuapp.com/api/v1/search', {params:{search: dish, dish_limit: 10, dish_page: this.state.dish_page, location: "Kakinada, East"}}).then(res => {
     	// console.log("@@@@@@@@@@@@@@@@@@@@", res)
     	if(res.data.dishes.length){
     		this.setState({dish_page: this.state.dish_page + 1 })
     		var results = this.state.results;
     		this.setState({
				  results: this.state.results.concat(res.data.dishes)
				})
	   		// this.setState({results:res.data.dishes })
				// console.log("PPPPPP", this.state.results)
	   		this.setState({data:res.data.dishes })
	   		const customStore = new Store('posts-store', 'DISHES');
			 	set('dish_rate', res.data.dishes, customStore)
	   		// console.log("@@@@@@@@@@@@@@@@@@@@", this.state.data)
	   		// console.log("data", this.state.results)
	   		return res.data.dishes[0];
   	  }else{
   	  	this.setState({isToast: true})
   	  	this.notify("Searched Dishes are not available")
   	  	setTimeout(function() {
   	  		window.location.href = '/'
   	  	}, 3000)
   	  }
    })
	}

	handleRestaurant(e){
		this.setState({res: e, res_redirect: true})
		var token = localStorage.getItem("token")
		if (this.state.redirect) {
			// console.log(e)
      return <Redirect to={{ pathname: '/RestaurantProfile', state: {id: e } }} />
    }
    axios.get('https://foodfie.herokuapp.com/api/v1/restaurants/'+ e +'', {headers: { Authorization: token }}).then(res => {
      this.setState({results: res.data.restaurant.dishes, })
	    // console.log("Restaurant Dishes", this.state.results)
    })
	}

	goBack(){
    this.props.history.push('/Search');
  }

  notify = (data) => toast.info(data);

  mapsHandle(){
  	// console.log("GOOGLE MAPS")
  	this.setState({maps: true})
  }

	handleDish(e){
    this.setState({ dish: e, redirect: true})
	}

	filterHandle(){
		 this.setState({filter: true})
	}
	dishRating(item){
		localStorage.setItem("rate_dish", item.id)
		this.setState({rating:true})
		// console.log(item)
	}

	filterSubmit(){
		// console.log("((((", this.state)
		var token = localStorage.getItem('token')
		axios.get('https://foodfie.herokuapp.com/api/v1/search',
			{
				params:
				{
					location: "Kakinada, East",
					min_price: this.state.min,
					max_price:this.state.max,
					rating:this.state.rating_by,
					sort_by: this.state.sort_by,
					// meals: this.state.meals,
					dietarien: this.state.dietarien
				}
			},

			{headers: { authorization: token }}
			).then(res => {
				// console.log(res)
				if (res.data.dishes.length === 0 ){
					// this.setState({no_dishes: true})
					this.setState({isToast: true})
  		    this.notify("Dishes Not found as per your filters!!!!")
			  	this.setState({ filter: true })
				}
				this.setState({data:res.data.dishes })
				return res.data.dishes[0]
		}).then(res=>{
			axios.get('https://foodfie.herokuapp.com/api/v1/restaurants/'+ res.restaurant_id +'', {headers: { authorization: token }}).then(res => {
	      this.setState({results: res.data.restaurant.dishes})
	      // console.log("$$$$$$$$$$$", res)
	      this.setState({filter: false})
	    });
		}).catch(err =>{

		})
	}

	filterClose(){
		this.setState({filter:false})
	}

	handleSort(e){
		// console.log("#####", e.target.value)
    this.setState({sort_by: e.target.value})
	}

	restaurantRedirect(){
		if(this.state.res_redirect){
			return <Redirect to={{ pathname: '/RestaurantProfile', state: {id: this.state.res, back_url: '/Dishes' } }} />
		}
	}

	handleRating(e){
		this.setState({rating_by: e.target.value})
	}

	handleMeal = (e) => {
		var meals = this.state.meals;
		let check = e.target.checked;
		if(check){
			this.setState({
	      meals: [...meals, e.target.value]
	    })
		}
		else{
			this.setState({
        meals : this.state.meals.filter(val => {return val!==e.target.value})
      })
		}
		// console.log(this.state.meals)
	}

	handleDietarian(e){
		var dietarien = this.state.dietarien;
		let check = e.target.checked;
		if(check){
			this.setState({
	      dietarien: [...dietarien, e.target.value]
	    })
		}
		else{
			this.setState({
        dietarien : this.state.dietarien.filter(val => {return val!==e.target.value})
      })
		}
		// console.log(this.state.dietarien)
	}

	handleFavourite(){
		this.setState({favorites: !this.state.favorites})
	}

	onSliderChange(e){
	  this.setState({min: e[0], max: e[1]})
	  // console.log(this.state)
	}

	handleUpdateDish(e){
		// console.log(e)
		this.setState({dish_up_id: e, update: true})
	}

	renderAddDish(){
		if(this.state.update){
			return <Redirect to={{ pathname: '/AddDish', state: {id: this.state.dish_up_id , back_url: '/Dishes'} }} />
		}
	}


	redirectMaps(){
		if(this.state.maps){
			return <Redirect to={{ pathname: '/GoogleMaps' }} />
		}
	}

	ratingRedirect(){
		if(this.state.rating){
			 return <Redirect to={{ pathname: '/Rating' }} />
		}
	}
	renderRedirect(){
    if (this.state.redirect) {
      return <Redirect to={{ pathname: '/DishProfile', state: {dish: this.state.dish, back_url: '/Dishes' } }} />
    }
  }

	render(){
		return(
			<div className="main_div">
			 {this.renderAddDish()}
			  {
		    	this.state.isToast ? <ToastContainer /> : null
		    }
			  {this.renderRedirect()}
			  { this.ratingRedirect()}
			  { this.redirectMaps() }
			  { this.restaurantRedirect() }
			  {
			  	!this.state.filter ?
			  <div>
			    <InfiniteScroll
					  dataLength={this.state.results.length} //This is important field to render the next data
					  next={this.getRestaurantDishesData}
					  hasMore={true}
					  loader={<h4>Loading...</h4>}
					  endMessage={
					    <p style={{textAlign: 'center'}}>
					      <b>Yay! You have seen it all</b>
					    </p>
					  }
					  >
				 	<div className="result_nav">
				 		<div className="result_back">
				 			<p onClick={this.goBack}> <i className="fa fa-chevron-left"></i> RESULTS </p>
				 		</div>
				 		<div className="result_filter_block">
				 			<Link to="#" onClick={()=>this.mapsHandle()}><i className="fa fa-map-o" aria-hidden="true"></i></Link>
				 			<Link to="#" onClick={()=> this.filterHandle() }><img src="./images/filter.png" alt="filter" width="20px" height="20px" /></Link>
				 		</div>
				 	</div>
					<p className="rest_header">RESTAURANTS</p>
					<DragScrollProvider>
				    {
				    	({ onMouseDown, ref }) => (
				      <div className="rest_block" onMouseDown={onMouseDown} ref={ref} >
								{
									this.state.data.map((item, index)=>{
										return(
											<div key={item.id} className="rest_div">
												<div className="test">
													<img src="./images/login_bg.jpg" className="rounded-circle" alt="Restaurant Logo" width="35" height="35" />
													<p onClick={()=>this.handleRestaurant(item.restaurant.id)}>{item.restaurant_name}</p>
													<img className="rest_heart" src="./images/heart.png" alt="login" width="15px" height="15px" />
													<p className="rest_percentage">{item.restaurant_rating}<small>%</small></p>
													<p className="rest_add">{item.restaurant.city}</p>
												</div>
												<div className="rest_phn">
													<p className="rest_contact">
										      	<i className="fa fa-phone"><a href={"tel:+" + item.restaurant.phone_number}>{item.restaurant.phone_number}</a></i>
										      </p>
												</div>
											</div>
										)
									})
								}
							</div>
				    )
				  }
				</DragScrollProvider>
					<p className="dishes_ind">DISHES</p>
					<RestaurantList restaurants={this.state.results} updateDish={this.handleUpdateDish} onRating={this.dishRating} onClick={this.handleDish} />
					</InfiniteScroll>
				</div>
				:
				<div className="main_div">
				<div className="result_nav">
			 		<div className="result_back">
			 			<p onClick={this.filterClose}> <i className="fa fa-chevron-left"></i> FILTER </p>
			 		</div>
			 		<div className="result_filter_block">
			 			<Link to="#" onClick={()=>this.filterSubmit()}><img src="./images/correct-signal.png" alt="filter" width="20px" height="20px" /></Link>
			 		</div>
			 	</div>

			 	{
		    	this.state.isToast ? <ToastContainer /> : null
		    }

			 	<div className="sort_by">
			 		<p>SORT BY</p>
			 		<div className="radio_btn_set">
					  <input type="radio" value="rating" id="test1" name="radio-group" onChange={this.handleSort}/>
					  <label htmlFor="test1">Rating</label>
				    <input type="radio" value="price" id="test2" name="radio-group" onChange={this.handleSort}  />
				    <label htmlFor="test2">Price</label>
				    <input type="radio" value="distance" id="test3" name="radio-group" onChange={this.handleSort} />
				    <label htmlFor="test3">Distance</label>
				  </div>
			 	</div>

			 	<div className="favorites_block">
			 		<p>SHOW FAVOURITES FIRST</p>
			 		<div className="fav_check">
				 		<label className="container">
						  <input type="checkbox" onChange={this.handleFavourite}/>
						  <span className="checkmark"></span>
						</label>
	        </div>
			 	</div>


			 	<div className="price_slider">
			 		<p>PRICE RANGE</p>
          <Range defaultValue={[0, 1000]} min={0} max={1000}
          onChange={this.onSliderChange} />
          <span className="min_range"><i class="fa fa-inr" aria-hidden="true"></i>{this.state.min}</span>
          <span className="max_range"><i class="fa fa-inr" aria-hidden="true"></i>{this.state.max}</span>
			 	</div>

			 	<div className="rating_by">
			 		<p>RATING</p>
			 		<div className="radio_btn_set">
					  <input type="radio" value='' id="all"  name="rate-group" onChange={this.handleRating} />
					  <label htmlFor="all" >ALL</label>
				    <input type="radio" id="50" value="5" name="rate-group" onChange={this.handleRating} />
				    <label htmlFor="50">50%+</label>
				    <input type="radio" id="75" value="7" name="rate-group" onChange={this.handleRating}/>
				    <label htmlFor="75">75%+</label>
				    <input type="radio" id="90" value="9" name="rate-group" onChange={this.handleRating}/>
				    <label htmlFor="90">90%+</label>
				  </div>
			 	</div>

			 	<div className="tags_block">
				 	<div className="tags_list">
				 		<p>ENTREE</p>
				 		<div className="fav_check">
					 		<label className="container">
							  <input value="entree" type="checkbox" onChange={this.handleMeal.bind(this)} />
							  <span className="checkmark"></span>
							</label>
		        </div>
				 	</div>
				 	<div className="tags_list">
				 		<p>MAIN</p>
				 		<div className="fav_check">
					 		<label className="container">
							  <input value="main" type="checkbox" onChange={this.handleMeal} />
							  <span className="checkmark"></span>
							</label>
		        </div>
				 	</div>
				 	<div className="tags_list">
				 		<p>DESSERT</p>
				 		<div className="fav_check">
					 		<label className="container">
							  <input value="dessert" type="checkbox" onChange={this.handleMeal} />
							  <span className="checkmark"></span>
							</label>
		        </div>
				 	</div>
				 	<div className="tags_list">
				 		<p>DRINK</p>
				 		<div className="fav_check">
					 		<label className="container">
							  <input value="drink" type="checkbox" onChange={this.handleMeal} />
							  <span className="checkmark"></span>
							</label>
		        </div>
				 	</div>
				</div>

				<div className="tags_block">
				 	<div className="tags_list">
				 		<p><span className="round_alpha">V</span>VEGETERIAN</p>
				 		<div className="fav_check">
					 		<label className="container">
							  <input value="vegeterian" type="checkbox" onChange={this.handleDietarian} />
							  <span className="checkmark"></span>
							</label>
		        </div>
				 	</div>
				 	<div className="tags_list">
				 		<p><span className="round_alpha">VV</span>VEGAN</p>
				 		<div className="fav_check">
					 		<label className="container">
							  <input value="vegan" type="checkbox" onChange={this.handleDietarian} />
							  <span className="checkmark"></span>
							</label>
		        </div>
				 	</div>
				 	<div className="tags_list">
				 		<p><span className="round_alpha">GF</span>GLUTEN FREE</p>
				 		<div className="fav_check">
					 		<label className="container">
							  <input value="gluten free" type="checkbox" onChange={this.handleDietarian} />
							  <span className="checkmark"></span>
							</label>
		        </div>
				 	</div>
				</div>
		  </div>
			}

			</div>

		)
	}
}