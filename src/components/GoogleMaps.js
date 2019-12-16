import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Store, get } from 'idb-keyval';
import axios from 'axios';


export default class GoogleMaps extends Component {

	static defaultProps = {
    center: {
      lat: 16.9754,
      lng: 82.2352
    },
    zoom:14
  };

  constructor(props) {
  	super(props);
  	this.state = {
	  	data: [],
	  	res_dishes: []
	  }
  }

  resturantDishes(text){
  	// alert("success " + text + " ")
		var token = localStorage.getItem("token")

  	axios.get('https://foodfie.herokuapp.com/api/v1/restaurants/'+ text +'', {headers: { Authorization: token }}).then(res => {
      this.setState({res_dishes: res.data.restaurant.dishes })
	    // console.log("Restaurant Dishes", this.state.res_dishes)
    })

  }

  handleMapClose(){
  	this.props.history.push('/Dishes');
  }

  componentDidMount(){

  	if(!localStorage.getItem('token')){
		  window.location.href = '/#/'	
	  }
  	const customStore = new Store('posts-store', 'DISHES');
		get('dish_rate', customStore).then(data =>{
			if(data && data.length ){
				this.setState({data: data})
				var token = localStorage.getItem("token")
		    axios.get('https://foodfie.herokuapp.com/api/v1/restaurants/'+ data[0].restaurant_id+'', {headers: { Authorization: token }}).then(res => {
		      this.setState({res_dishes: res.data.restaurant.dishes })
			    // console.log("Restaurant Dishes", this.state.res_dishes)
		    })
			}
		})
  }
	render(){
		  const AnyReactComponent = ({ text, id, dishes_count}) =>
				<div key={id} className="marker_align" onClick={()=>this.resturantDishes(text)} >
					<svg width="100" height="100">
						{
								id === 0 ?
								<path id="marker" className="st0" d="M81.2,0H18.7c-3.5,0-6.2,2.8-6.2,6.2v62.6c0,3.5,2.8,6.2,6.2,6.2h20l9.5,22.8c1,2.9,2.5,2.9,3.5,0l9.4-22.7h20
						c3.5,0,6.3-2.8,6.3-6.2V6.2C87.5,2.8,84.7,0,81.2,0z"/>
								:
								<path id="marker" className="st1" d="M81.2,0H18.7c-3.5,0-6.2,2.8-6.2,6.2v62.6c0,3.5,2.8,6.2,6.2,6.2h20l9.5,22.8c1,2.9,2.5,2.9,3.5,0l9.4-22.7h20
						c3.5,0,6.3-2.8,6.3-6.2V6.2C87.5,2.8,84.7,0,81.2,0z"/>
						}
					</svg>
					<p>{dishes_count}</p>
				</div>;
		return(
			<div>
				<div className="loc_header">
					<p>KAKINADA</p>
					<img src="./images/close.png" onClick={()=> this.handleMapClose()} alt="login" width="30px" height="30px" />
				</div>
				<div className="google_map_block">
					<GoogleMapReact
	          bootstrapURLKeys={{ key: 'AIzaSyBxBIfFGmL6adUEtytF2IYA10JZjQc5_sk' }}
	          defaultCenter={this.props.center}
	          defaultZoom={this.props.zoom}
	        >
	        {
	        	this.state.data && this.state.data.length ?
	        	this.state.data.map((item, index) => {
	        		return(
		      			<AnyReactComponent
				          lat={item.restaurant.latitude}
				          lng={item.restaurant.longitude}
				          text={item.restaurant_id}
				          id={index}
				          dishes_count={item.dishes_count}
				        />
			        )
	        	}) : null
	        }
	        </GoogleMapReact>
				</div>
				<div className="map_dishes">
					{
						this.state.res_dishes && this.state.res_dishes.length ?
						this.state.res_dishes.map((item, index)=>{
							return(
							<div className="map_dishes_list">
								<img src="./images/login_bg.jpg" className="rounded-circle" alt="Restaurant Logo" width="60" height="60" />
								<p className="map_dishes_dish_name">{item.name}</p>
								<p className="map_dishes_res_name">{item.restaurant_name}</p>
								<img className="map_dishes_heart_img" width="30" height="30" 
								src="./images/heart.png" alt="login" />
								{
									(item.average_rating === 0) ?
									<span className="map_dishes_rating">10%</span>
									:
									<span className="map_dishes_rating">{item.average_rating}%</span>
								}
							</div>
							)
						}) : null
					}
				</div>
			</div>
		)
	}
}
