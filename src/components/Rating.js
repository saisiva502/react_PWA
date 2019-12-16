import React, {Component} from 'react'
import axios from 'axios';
import $ from 'jquery';
import { withStyles } from '@material-ui/core/styles';
import Slider from 'rc-slider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { Store, set, get } from 'idb-keyval';
// import { Offline, Online } from "react-detect-offline";
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const GreenCheckbox = withStyles({
  root: {
  	left: '10px',
  	fontSize: '5px',
    color: '#61dafb',
    '&$checked': {
      color: '#61dafb',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />)


export default class Rating extends Component {
  constructor(props){
  	super(props);

  	this.state = {
  		rating: 1,
  		dish_data: '',
  		image: '',
  		restaurant_name: '',
  		comment: '',
  		taggings: [],
  		connection: true,
  		isToast: false,
  		redirect:false,
  		res_pro: false
  	}

  	this.onSliderChange = this.onSliderChange.bind(this)
  	this.handleRating = this.handleRating.bind(this)
  	this.ratingComment = this.ratingComment.bind(this)
  	this.tag_change = this.tag_change.bind(this)
  	this.handleClose = this.handleClose.bind(this)
  	this.renderRestaurantProfile = this.renderRestaurantProfile.bind(this)
  }

  notify = (data) => toast.info(data);

  handleRating(e){
  	e.preventDefault()
  	const rating_dish = localStorage.getItem("rate_dish")
  	var token = localStorage.getItem("token")
  	var data = {
  		comment: this.state.comment,
  		tags: this.state.taggings,
  		rating:{weight: this.state.rating},
  		dish_id: rating_dish,
  		auth: token
  	}
   if ('serviceWorker' in navigator && 'SyncManager' in window){
   	navigator.serviceWorker.ready
 	   .then(function(sw){
		 	 const customStore = new Store('rating_sync', 'rating_data');
		 	 set('dish_rate', data, customStore).then(function(data){
		 	  sw.sync.register('sync-rating')
		 	 })
		 	 get('dish_rate', customStore).then(function(res){
		 	 	 // console.log(res, "DATA")
		 	 })
	 	  })
    }else{
    	var ratings = {
  		comment: this.state.comment,
  		tags: this.state.taggings,
  		rating:{weight:this.state.rating}
  	}
  		axios.post('https://foodfie.herokuapp.com/api/v1/dishes/'+ rating_dish +'/ratings', ratings, {headers: { Authorization: token }}).then(res => {
  			// console.log("Without indexedDB", res)
  		})
  	}
  	if(navigator.onLine){
  		this.setState({isToast: true})
  		this.notify("Thankyou for submitting your valuable review!!!")
  	}else{
  		this.setState({isToast: true})
  		this.notify("you are offline, we will submit your review later your internet connection established.")
  	}

  	setTimeout(() => {
  		this.setState({ redirect: true })
	  }, 3000);
  }


  handleClose(){
  	if(this.props.location.state){
  		if(this.props.location.state.res_data){
  			this.setState({res_pro: true})
  		}else{
  	    this.props.history.push(this.props.location.state.back_url);
  		}
  	}else{
  	  this.props.history.push('/Dishes');
  	}
  }

  renderRestaurantProfile(){
  	if(this.state.res_pro){
  		return <Redirect to={{pathname: '/RestaurantProfile', state: this.props.location.state.res_data }} />
  	}
  }


  renderRedirect(){
  	// this.setState({ redirect: true })
  	if(this.state.redirect){
  	  this.props.history.push('/Dishes');
  	}
  }

  ratingComment(e){
  	this.setState({comment: e.target.value})
  }

  componentDidMount(){
  	if(!localStorage.getItem('token')){
		  window.location.href = '/#/'	
	  }
	    console.log(this.props.location)

  	const dish = localStorage.getItem("rate_dish")
  	var token = localStorage.getItem("token")
    axios.get('https://foodfie.herokuapp.com/api/v1/dishes/'+ dish +'', {headers: { Authorization: token }}).then(res => {
	    this.setState({dish_data: res.data.dish, restaurant_name: res.data.dish.restaurant_name.toUpperCase()})
	    if(res.data.dish.images && res.data.dish.images.length){
	      this.setState({image: res.data.dish.images[0].image_url})
	    }else{
	      this.setState({image: "./images/Indian-Food.jpg"})
	    }
    })
  }

  onSliderChange(e){
	  this.setState({rating: e })
	  // console.log("RATE", this.state.rating)
	}

	tag_change = () => {
		var tags = []
		 $(':checkbox:checked').each(function(i){
      tags[i] = $(this).attr("value");
    });
    this.setState({taggings: tags},() => {})
	}

  render(){
  	return(
  	  <div className="main">
  	  	{ this.renderRedirect() }
  	  	{this.renderRestaurantProfile()}
			  <div className="row">
			  	<div className="col-md-12 col-lg-12 col-xs-12">
						<div className="result_img_profile">
				      <img src={this.state.image} onError={(e)=>{e.target.onerror = null; e.target.src="./images/Indian-Food.jpg"}} className="dish_image" width="100%" height="250px" alt="login" />
				      <h2 className="dish_name">{ this.state.dish_data.name}</h2>
							<h3 className="restaurant_name_rating"><b>{this.state.restaurant_name}</b> - <i className="fa fa-inr" aria-hidden="true"></i> {this.state.dish_data.price} </h3>
							<i className="plus_icon fa fa-pencil" ></i>
						  <i onClick={this.handleClose} class="back_icon fa fa-times" aria-hidden="true"></i>
					  </div>
					  <form onSubmit={this.handleRating}>
						  <div className="rating_slider">
						  	<p>WHAT DO YOU RATE THE DISH ?</p>
						  	<div className="slider_element">
						  	  <Slider onChange={this.onSliderChange} defaultValue={1} min={0} max={10}/>
						  	</div><span className="slider-value">{this.state.rating} %</span>
						  </div>

						  <div className="rating_comment">
						  	<div align="left" className="comment_block">
									<label>COMMENT</label><br/>
									<i className="fa fa-comment-o" aria-hidden="true"></i><input type="text" name="comment" onChange={this.ratingComment} placeholder="How was the dish ? ( Optional )" size="150" />
							  </div>
						  </div>
						  <hr />
							<div className="meal_type"><p>TYPE</p></div>
						  <FormGroup row>
						  	<div className="dish_meals_rating">
						      <FormControlLabel
						        control={
					          <GreenCheckbox
					            name="ENTREES"
					          />
						        }
						        label="ENTREES"
						      />
						      <FormControlLabel
						        control={
						        <GreenCheckbox
					            name="MAIN"
					          />
						        }
						        label="MAIN"
						      />
						      <FormControlLabel
						        control={
					          <GreenCheckbox
					            name="DESERT"
					          />
						        }
						        label="DESERT"
						      />
						      <FormControlLabel
						        control={
					          <GreenCheckbox
					            name="DRINK"
					          />
						        }
						        label="DRINK"
					        />
					      </div>
					    </FormGroup>
					    <hr />
					    <div className="tags_block">
							 	<div className="tags_list">
							 		<p><span className="round_alpha">V</span>VEGETERIAN</p>
							 		<div className="fav_check">
								 		<label className="container">
										  <input type="checkbox" value="VEGETARIAN" onClick={() => this.tag_change()} />
										  <span className="checkmark"></span>
										</label>
					        </div>
							 	</div>
							 	<div className="tags_list">
							 		<p><span className="round_alpha">VV</span>VEGAN</p>
							 		<div className="fav_check">
								 		<label className="container">
										  <input type="checkbox" value="VEGAN" onClick={() => this.tag_change()} />
										  <span className="checkmark"></span>
										</label>
					        </div>
							 	</div>
							 	<div className="tags_list">
							 		<p><span className="round_alpha">GF</span>GLUTEN FREE</p>
							 		<div className="fav_check">
								 		<label className="container">
										  <input type="checkbox" value="GLUTEN FREE" onClick={() => this.tag_change()} />
										  <span className="checkmark"></span>
										</label>
					        </div>
							 	</div>
				    	</div>
				    	<input type="submit" value="DONE" className="ratings_submit" />
				    </form>
				    {
				    	this.state.isToast ? <ToastContainer /> : null
				    }
					</div>
				</div>
			</div>
  	)
  }
}