import React from 'react';
import PropTypes from 'prop-types';

const RestaurantList = ({ restaurants, onClick, onRating, updateDish }) =>{
	return(
		<div className="row">
    	{
	  		restaurants && restaurants.length>0 ?
	    		restaurants.map((item, index)=>{
	    			return(
	    			  <div key={item.id} className="col-md- col-lg-6 col-sm-6">
								<div className="result_img">
									{
										item.images && item.images.length ?
										  <img src={item.images[0].image_url} onError={(e)=>{e.target.onerror = null; e.target.src="./images/Indian-Food.jpg"}} onClick={()=>onClick(item.id)} className="dish_image" width="100%" height="250px" alt="login" />
										:
										<img src="./images/login_bg.jpg" onClick={()=>onClick(item.id)} className="dish_image" width="100%" height="250px" alt="login" />
									}
									<h2 className="dish_name" key={item.id}>{ item.name }</h2>
									<img className="heart_img" src="./images/heart.png" alt="login" />
									{
										(item.average_rating === 0) ?
									    <p className="result_percentage" onClick={()=>onRating(item)}>10<small>%</small></p>
									    :
									    <p className="result_percentage" onClick={()=>onRating(item)}>{item.average_rating}<small>%</small></p>

									}
									<p className="result_percentage" onClick={()=>onRating(item)}>{item.average_rating}<small>%</small></p>
									<h3 className="restaurant_name">{item.restaurant_name.toUpperCase()} - <i className="fa fa-inr" aria-hidden="true"></i>
{item.price} </h3>
									<h3 className="vote_count"><b>{item.votes} VOTES </b></h3>
									<div className="effect_test">
									<img className="plus_icon" src="./images/plus_lite.png" alt="add" onClick={()=>updateDish(item.id)}/>
									</div>
							  </div>
							  <div className="location_bar">
						      <p className="dish_location_style">
						      	<span>
						      		<i className="fa fa-map-marker" aria-hidden="true"></i>
						      	</span>{item.restaurant.address}
						      </p>
						      <p className="dish_contact">
                    <i className="fa fa-phone"><a href={"tel:+" + item.restaurant.phone_number }> CALL</a></i>
						      </p>
								</div>
						  </div>
	    			)
	    		}):
	    		null
	  	}
		</div>
	)
}

RestaurantList.propTypes = {
	restaurants: PropTypes.array,
	onClick: PropTypes.func,
}

export default RestaurantList;
// export default class ResultPartial extends Component {
// 	constructor(props){
// 		super(props);
// 		this.handleDish = this.handleDish.bind(this)
// 		this.state = {
// 			results :this.props.results
// 		}
// 	}


// 	// componentDidUpdate(prevProps, prevState) {
//  //    if (prevState.path !== this.state.path) {
//  //      let firebaseRef=firebase.database().ref(this.state.path);
//  //      this.setState({firebaseRef});
//  //      this.getData(firebaseRef);
//  //    }
//  //  }

//   static getDerivedStateFromProps(nextProps, prevState){
//     if(nextProps.results!==prevState.results){
//       this.setState({results: nextProps.results})
//     }
//     console.log("NEXT ", nextProps)
//   }



// 	componentDidMount(){
// 		console.log("MMMMMMMMMM", this.state.results)
// 	}
// 	handleDish(e){
// 		alert(e)
// 	}
// 	render(){
// 		return(
// 		    <div className="row">
// 		    	{
// 		    		this.state.results && this.state.results.length>0 ?
// 			    		this.state.results.map((item, index)=>{
// 			    			return(
// 			    			  <div key={item.id} className="col-md-6 col-lg-6 col-sm-6" onClick={()=>this.handleDish(item.id)}>
// 										<div className="result_img">
// 											<img src="./images/search_bg.jpg" width="100%" alt="login" />
// 											<h2 className="dish_name" key={item.id}>{ item.name }</h2>
// 											<img className="heart_img" src="./images/heart.png" alt="login" />
// 											<p className="result_percentage">95<small>%</small></p>
// 											<h3 className="restaurant_name"><b>{item.restaurant_name}</b>-<b>$15</b></h3>
// 											<h3 className="vote_count"><b>11 Votes</b></h3>
// 											<img className="plus_icon" src="./images/plus.png" alt="add" />
// 									  </div>
// 									  <div className="location_bar">
// 								      <p className="dish_location_style">
// 								      	<span>
// 								      		<i className="fa fa-map-marker" aria-hidden="true"></i>
// 								      	</span>{item.restaurant.address}
// 								      </p>
// 								      <p className="dish_contact">
// 								      	<span>
// 								      		<i className="call_icon fa fa-phone fa-rotate-270"></i>
// 								      	</span>CALL
// 								      </p>
// 										</div>
// 								  </div>
// 			    			)
// 			    		}):
// 			    	<h1>No Results found </h1>	
// 		    	}
// 		    </div>
// 		)
// 	}
// }


