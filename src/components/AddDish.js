import React, { Component } from 'react';
// import FileBase64 from 'react-file-base64';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';

// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
// import PlacesAutocomplete from 'react-places-autocomplete-extended'
import 'react-html5-camera-photo/build/css/index.css';

// const google = window.google;

const Zomato = require('zomato.js');
const zomato = new Zomato('3961ce44605d0506853a9a8d3ecd831c');

export default class AddDish extends Component {
	constructor(props){
		super(props);
		this.state = {
			restaurant: '',
			dish: '',
			price: '',
			files: [],
			addDishSuccess: false,
			isToast:false,
			imageData: {},
			isCamera: false,
			img: '',
			isPhotoTaken: false,
			image_name: '',
			facing_mode: false,
			redirect_res: '',
			latitude: '',
			longitude: '',
			address: {},
			restaurants: [],
			is_res_show: false,
			current_dish: '',
			btn_name: 'NEXT ITEM',
			restaurantProfile: false
		}
		this.handleDishCancel = this.handleDishCancel.bind(this);
		this.handleChange =  this.handleChange.bind(this)
		this.goBack = this.goBack.bind(this)
		this.cameraStart  = this.cameraStart.bind(this);
		this.onTakePhoto = this.onTakePhoto.bind(this);
		this.handleCameraFacing = this.handleCameraFacing.bind(this)
		this.handleCameraReset = this.handleCameraReset.bind(this)
		this.handleCurrentLocation = this.handleCurrentLocation.bind(this)
		this.onChange = (address) => this.setState({ address })
		this.handleRestaurants = this.handleRestaurants.bind(this)
		this.handleRestaurantName = this.handleRestaurantName.bind(this)
		this.updateDish = this.updateDish.bind(this)
	}
	notify = (data) => toast.info(data);

	handleChange(e) {
    let change = {}
    change[e.target.name] = e.target.value
    this.setState(change)

    if(this.state.restaurant.length>3){
	    // console.log(this.state.restaurant)
	    this.setState({is_res_show: false})
	    zomato
		  .restaurant({
		    res_id: 34383
		  })
		  .then(function(data) {
		    // console.log(data);
		  })
		  .catch(function(err) {
		    // console.error(err);
		  });
	  }
  }


	handleDishCancel = () =>{
		window.location.href = '/Search'
	}

	redirect(){
		if (this.state.addDishSuccess) {
      return <Redirect to={{ pathname: '/RestaurantProfile', state: {id: this.state.redirect_res, back_url: '/Dishes' } }} />
    }
	}

  goBack(){
  	if(this.props.location.state) {
  		if(this.props.location.state.res_data){
  			this.setState({restaurantProfile: true})
  		}else{
        this.props.history.push(this.props.location.state.back_url);
  		}
  	}else{
      this.props.history.push('/Search');
  	}
  }

  cameraStart(){
  	this.setState({isCamera: true})
  }

  renderRestaurantProfile(){
  	if(this.state.restaurantProfile){
  	  return <Redirect to={{ pathname: '/RestaurantProfile', state: this.props.location.state.res_data }} />
  	}
  }

  componentDidMount(){
  	if(!localStorage.getItem('token')){
		  window.location.href = '/#/'
	  }

	  var token = localStorage.getItem('token')

	  if(this.props.location.state){
	  	axios.get('https://foodfie.herokuapp.com/api/v1/dishes/'+ this.props.location.state.id +'', {headers: { Authorization: token }}).then(res => {
		    this.setState({current_dish: res.data.dish, btn_name: 'UPDATE ITEM', price: res.data.dish.price})
		    // console.log("Restaurant Satte", res)
      })
	  }

	  // console.log(this.props.location)
	  if (!('geolocation' in navigator)) {
      return;
    }
    navigator.geolocation.getCurrentPosition(this.handleCurrentLocation)
  }

  handleCurrentLocation(data){
  	this.setState({latitude: data.coords.latitude, longitude: data.coords.longitude})
  	// console.log("data", this.state)
  }

	handleDishPost = (e) =>{
		e.preventDefault()
		var token = localStorage.getItem("token")
		var data = {
			dish: {
				name: this.state.dish,
				price: this.state.price,
			},
			restaurant:{
			  name: this.state.restaurant,
			  address: this.state.address.address,
			  city: this.state.address.city,
			  latitude: this.state.address.latitude,
			  longitude: this.state.address.longitude,
			},
			image: this.state.img,
			image_name: this.state.image_name,
			image_content_type: "image/png"
		}
		axios.post("https://foodfie.herokuapp.com/api/v1/dishes", data, {headers:{
			Authorization: token
		}}).then(res =>{
			if(res.data.success === "Yes"){
				// console.log(res)
				this.setState({isToast: true})
				this.notify("Dish successfully addded by you ")
				setTimeout(function(){
				  this.setState({redirect_res:res.data.dish.restaurant_id , addDishSuccess:true})
				  // console.log(this.state)
				}.bind(this),3000)
			}else{
				// console.log(res)
			  this.setState({isToast: true})
				this.notify("Restaurant Not found check once !!!!!!!")
			}
		}).catch((error) =>{
			// console.log(error.data)
		})
		// console.log(this.state.restaurant)
	}

	handleCameraFacing(){
		this.setState({facing_mode: !this.state.facing_mode})
		// console.log(this.state.facing_mode)
	}

	handleCameraReset(){
		this.setState({isPhotoTaken: false})
		// console.log("data")
	}

	onTakePhoto =  (dataUri) => {
		let date = new Date();
    let dateformat = `${date.getTime()}`+".png";
    this.setState({img: dataUri, isPhotoTaken: true, image_name: dateformat}, ()=>{console.log(this.state.img)})
  }

  handleRestaurants(){
  	zomato
	  .search({
	    lat: this.state.latitude,
	    lon: this.state.longitude
	  })
	  .then(function(data) {
	    // console.log(data);
	    this.setState({restaurants: data.restaurants, is_res_show: true})
	    // console.log(data)
	  }.bind(this))
	  .catch(function(err) {
	    console.error(err);
	  });
  }

  handleRestaurantName(name, address){
  	// console.log(name, address)
  	this.setState({restaurant: name, address: address, is_res_show:false})
  	// console.log(this.state.restaurant)
  }

  updateDish(e){
  	e.preventDefault()
  	// console.log("update")
  	var token = localStorage.getItem("token")
  	if(this.state.current_dish.images && this.state.current_dish.images[0]){
  		var data = {
				dish: {
					price: this.state.price,
				},
				image_id: this.state.current_dish.images[0].id,
				image: this.state.img,
				image_name: this.state.image_name,
				image_content_type: "image/png"
		  }
  	}else{
  		var data = {
				dish: {
					price: this.state.price,
				},
				image: this.state.img,
				image_name: this.state.image_name,
				image_content_type: "image/png"
		  }
  	}

		axios.put('https://foodfie.herokuapp.com/api/v1/dishes/'+ this.props.location.state.id +'', data, {headers:{
			Authorization: token
		}}).then(res =>{
			// console.log(res)
			if(res.data.success === "Yes"){
			// 	console.log(res)
				this.setState({isToast: true})
				this.notify("Dish successfully Updated ")
				// setTimeout(function(){
			// 	  this.setState({redirect_res:res.data.dish.restaurant_id , addDishSuccess:true})
			// 	  console.log(this.state)
			// 	}.bind(this),3000)
			// }else{
				// console.log(res)
			 //  this.setState({isToast: true})
				// this.notify("Restaurant Not found check once !!!!!!!")
			}
		}).catch((error) =>{
			// console.log(error.data)
		})
  }

	render(){
		// const inputProps = {
  //     value: this.state.address,
  //     onChange: this.onChange,
  //   }

		// const options = {
		//   location: new google.maps.LatLng(this.state.latitude, this.state.longitude),
		//   radius: 2000,
		//   types: ['restaurant']
		// }
		return(
			<div>
				<div className="row">
				{ this.renderRestaurantProfile() }
			  	<div className="col-md-12 col-lg-12 col-xs-12">
						<div className="result_img_profile">
						{
				    	this.state.isCamera ?
				    		this.state.isPhotoTaken ?
			          <img src={this.state.img } className="dish_image" width="100%" height="260px" alt="login" />
			          :
			          <div className="dish_image">
					        <Camera
					          isImageMirror = {false} idealFacingMode = { this.state.facing_mode ? FACING_MODES.ENVIRONMENT : FACING_MODES.USER } onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
					        />
					      </div>
					    :
			        <img src={ (this.state.current_dish.images && this.state.current_dish.images[0]) ? this.state.current_dish.images[0].image_url :'./images/add_dish.jpg'} className="dish_image" width="100%" onError={(e)=>{e.target.onerror = null; e.target.src="./images/Indian-Food.jpg"}} height="260px" alt="login" />
				    }
				    {
				    	this.state.isCamera ?
				    	<div>
					    	<img src='./images/image_reset.png'  onClick={this.handleCameraReset} className="dish_image_reset" width="30px" height="30px" alt="login" />
					      <img src='./images/image_rotate.png' onClick={this.handleCameraFacing} className="dish_image_rotate" width="40px" height="40px" alt="login" />
				      </div>
				      :
				      null
				    }
				    <i onClick={this.cameraStart} className="camera_icon fa fa-camera" aria-hidden="true"></i>
				    <img src='./images/cancel.png' onClick={this.goBack} className="cancel_icon" width="15px" height="15px" alt="login" />
					  </div>
					  <form onSubmit={this.state.current_dish ? this.updateDish : this.handleDishPost}>
						  <div align="left" className="from_align">
								<label>RESTAURANT</label><br/>
								{
									this.state.current_dish ?
								  <div><img src='./images/chef_hats.png' width="20px" height="20px" alt="login" /><input id="autocomplete" type="text" value={this.state.current_dish.name}  placeholder="Where are you now ?" readonly="" /></div>
								  :
								  <div><img src='./images/chef_hats.png' width="20px" height="20px" alt="login" /><input id="autocomplete" onClick={this.handleRestaurants} type="text" onChange={this.handleChange.bind(this)} name="restaurant" value={this.state.restaurant}  placeholder="Where are you now ?" required/></div>
								}
						  </div>
					  		{
					  			this.state.is_res_show ?
					  			<div className="res_list_block">
					  			{
					  			this.state.restaurants.length ?
						  			this.state.restaurants.map((item, index)=>{
						  				return(
						  				  <p className="res_list_name" onClick={()=>this.handleRestaurantName(item.name, item.location)}>{item.name}</p>
						  				)
						  			}):null
						  		}
						  		</div>
					  			: null
					  		}

						  <div align="left" className="from_align">
								<label>DISH NAME</label><br/>
								{
									this.state.current_dish ?
								  <div><img src='./images/dish_icons.png' width="20px" height="20px" alt="login" /><input type="text" value={this.state.current_dish.restaurant.name} readonly="" /></div>
								  :
								  <div><img src='./images/dish_icons.png' width="20px" height="20px" alt="login" /><input type="text" name="dish" onChange={this.handleChange.bind(this)} placeholder="What is the dish called ?" required/></div>
								}
						  </div>
						  <div align="left" className="from_align">
								<label>PRICE</label><br/>
								<img src='./images/prices.png' width="20px" height="20px" alt="login" /><input type="text" name="price" value={this.state.price} onChange={this.handleChange.bind(this)} placeholder="How much does this cost ?" required/>
						  </div>
						  <div align="left" className="submit_align">
						  	<button type="submit" className="add_dish_submit form-control">
						  		<i className="fa fa-camera" aria-hidden="true"></i>{ this.state.btn_name }
						  	</button>
						  </div>
					  </form>
					  {
					  	this.redirect()
					  }
					  {
					  	this.state.isToast ? <ToastContainer /> : null
					  }
			  	</div>
			  </div>
			</div>
		)
	}
}