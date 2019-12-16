import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Range } from 'rc-slider';
import axios from 'axios';


export default class Filter extends Component{

	constructor(props){
		super(props);
		this.state = {
			result: false,
		  min: 200,
		  max: 900,
		  sort_by: '',
		  rating: '',
		  meals: [],
		  dietarien: [],
		  favorites: false
		}

		this.onSliderChange = this.onSliderChange.bind(this)
		this.handleSort = this.handleSort.bind(this)
		this.handleRating = this.handleRating.bind(this)
		this.handleFavourite = this.handleFavourite.bind(this)
		this.handleMeal = this.handleMeal.bind(this)
		this.handleDietarian = this.handleDietarian.bind(this)
	}

	componentDidMount(){
		if(!localStorage.getItem('token')){
		  window.location.href = '/#/'	
	  }
	}
	filterHandle(){
		// console.log("((((", this.state)
		var token = localStorage.getItem('token')
		
		axios.get('https://foodfie.herokuapp.com/api/v1/search',
			{
				params:
				{
					location: "Kakinada, East",
					min_price: this.state.min,
					max_price:this.state.max,
					rating:this.state.rating,
					sort_by: this.state.sort_by,
					meals: this.state.meals,
					dietarien: this.state.dietarien
				}
			},

			{headers: { authorization: token }}
			).then(res => {
			// console.log("FILETER",res)
		})
	}
	handleSort(e){
		// console.log("#####", e.target.value)
    this.setState({sort_by: e.target.value})
	}

	handleRating(e){
		this.setState({rating: e.target.value})
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

	render(){
		return(
			<div className="main_div">
				<div className="result_nav">
			 		<div className="result_back">
			 			<p> <i className="fa fa-chevron-left"></i> FILTER </p>
			 		</div>
			 		<div className="result_filter_block">
			 			<Link to="#" onClick={()=>this.filterHandle()}><img src="./images/correct-signal.png" alt="filter" width="20px" height="20px" /></Link>
			 		</div>
			 	</div>

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
          <Range defaultValue={[10, 900]} min={0} max={1000}
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
		)
	}
}