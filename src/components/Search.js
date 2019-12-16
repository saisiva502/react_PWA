import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
// import axios from 'axios';
import Sidebar from "react-sidebar";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Modal from 'react-awesome-modal';


export default class Search extends Component {
	constructor(props){
		super(props);
		this.state = {
		  username: '',
		  search: '',
		  results: [],
		  redirect: false,
		  pushNotification: false,
		  sidebarOpen: false,
		  myProfile: false,
		  myFavorites: false,
		  followers: false,
		  logout: false,
		  logout_status: false
	  }
	  this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
		this.handleLogOut = this.handleLogOut.bind(this);
		this.myProfileHandler = this.myProfileHandler.bind(this);
		this.myFavoritesHandler = this.myFavoritesHandler.bind(this);
		this.followersHandler = this.followersHandler.bind(this);
		this.handleLogoutCancel  = this.handleLogoutCancel.bind(this);
		this.handleLogoutSubmit = this.handleLogoutSubmit.bind(this)
	}
	componentDidMount(){
		if(!localStorage.getItem('token')){
			window.location.href = '/#/'
		}

		var token = localStorage.getItem('token')
		const vapidKeyArray = this.urlBase64ToUint8Array('BGaBmbHJz7l_KvpfcPLCDCfY6kQZtDRRFGSjp8YV7j4tG6s7yTHRvL4up1dFIyfMhCJYFn_Op5F_KkuI9mHPPJ0');
		// console.log("OOOO",vapidKeyArray )

    var reg;
    navigator.serviceWorker.ready
    .then(function(swreg) {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(function(sub) {
      if (sub === null) {
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKeyArray
        });
      } else {
        // We have a subscription
      }
    })
    .then(function(newSub) {
      return fetch('https://foodfie.herokuapp.com/api/v1/subscriptions', {
        method: 'POST',
        headers: {
        	Autherization: token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
    })
		var user = localStorage.getItem('username')
		this.setState({username: user})
	}

	myFavoritesHandler(){
		this.setState({myFavorites: true})
	}

	followersHandler(){
		this.setState({followers: true})
	}

	urlBase64ToUint8Array(base64String) {
	  var padding = '='.repeat((4 - base64String.length % 4) % 4);
	  var base64 = (base64String + padding)
	    .replace(/-/g, '+')
	    .replace(/_/g, '/');

	  var rawData = window.atob(base64);
	  var outputArray = new Uint8Array(rawData.length);

	  for (var i = 0; i < rawData.length; ++i) {
	    outputArray[i] = rawData.charCodeAt(i);
	  }
	  return outputArray;
	}

	onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  }
  handleLogOut(){
  	// alert("Hello")
  	this.setState({ logout: true })
  }


	handleChange(e) {
	  let change = {}
	  change[e.target.name] = e.target.value
	  this.setState(change)
	}

  notificationGranted = (data) => {
		var options = {
			body: "You will get notifications from Now!!"
		}
		// console.log("Checking")
		new Notification(data, options)
	}
	handleSubmit(event){
	  localStorage.setItem("dish", this.state.search)
	  this.setState({ redirect: true })
	}

	myProfileHandler(){
		this.setState({myProfile: true })
	}

	renderMyProfile(){
		if(this.state.myProfile){
      return <Redirect to={{ pathname: '/MyProfile'}} />
		}
	}

	renderFollower(){
		if(this.state.followers){
      return <Redirect to={{ pathname: '/Followers' }} />
		}
	}
	handleClose(){
		// console.log("Close")
		this.setState({logout:false})
	}


	renderMyFavourites(){
		if(this.state.myFavorites){
			return <Redirect to={{pathname: '/MyFavorites'}} />
		}
	}

  renderRedirect(){
    if (this.state.redirect) {
      return <Redirect to={{ pathname: '/Dishes', state: {search: this.state.search} }} />
    }
  }

  handleLogoutCancel(){
  	// console.log("cancelled")
  	this.setState({logout: false})
  }

  handleLogoutSubmit(){
  	// console.log("logout")
  	// var token = localStorage.getItem("token")
  	// axios.get('https://foodfie.herokuapp.com/api/v1/signout', {headers:{Authorization: token}}).then(res=>{
  	// 	if(res.status === 200){
  	// 		this.setState({logout_status: true})
  	// 	}
  // 	this.setState({logout_status: true})

		// if(this.state.logout_status){
			localStorage.clear();
			window.location.href = '/'
		// }
  }
	render(){

		const sidebarStyles = {
	    sidebar: {
      	background: "white",
      	width: "80%",
      	zIndex: 99999,
      }
		}
		return(
			<div>
			  {this.renderRedirect()}
			  <div>
			  	<div>
		        <Navbar className="navbar_main" light expand="md">
		          <NavbarBrand href="/"><img src="./images/logo_brand.png" width="50px" height="50px" alt="logo" /></NavbarBrand>
		          <NavbarToggler onClick={this.toggle} />
		          <Collapse isOpen={this.state.isOpen} navbar>
		            <Nav className="ml-auto" navbar>
		              <NavItem>
		                <NavLink href="/Search">Search</NavLink>
		              </NavItem>
		              <NavItem>
		                <NavLink href="#">Favorites</NavLink>
		              </NavItem>
		              <NavItem>
		                <NavLink href="#">Add Dish</NavLink>
		              </NavItem>
		              <NavItem>
		                <NavLink href="#">Settings</NavLink>
		              </NavItem>
		              <NavItem>
		                <NavLink href="#">Profile</NavLink>
		              </NavItem>
		            </Nav>
		          </Collapse>
		        </Navbar>
		      </div>
			  </div>
				<div>
					{this.renderMyProfile()}
					{this.renderMyFavourites()}
					{ this.renderFollower()}
					<Sidebar
		        sidebar={
		        	<div>
			          <div className="nav_user_block">
			          	<img src="./images/login_bg.jpg" height="80px" width="80px" className="nav_user_profile rounded-circle" alt="user profile" />
			          	<h2 className="nav_user_name">{this.state.username}</h2>
			          	<p className="nav_user_city">KAKINADA</p>
			          </div>
			          <div className="nav_links_block">
				          <div className="nav_menu_block">
				          	<p><i className="fa fa-search" aria-hidden="true"></i>SEARCH</p>
				          	<p onClick={this.myProfileHandler}><i className="fa fa-user-circle-o" aria-hidden="true"></i>MY PROFILE</p>
				          	<p onClick={this.followersHandler}><i className="fa fa-star-o" aria-hidden="true"></i>FOLLOWERS </p>
				          	<p onClick={this.myFavoritesHandler}><i className="fa fa-star-o" aria-hidden="true"></i>MY FAVORITES</p>
				          	<p><img src="./images/settings.png" width="20px" height="20px" alt="settings" /> SETTINGS</p>
				          </div>
				          <div className="nav_logout_block">
				            <p onClick={this.handleLogOut}><i className="fa fa-sign-out" aria-hidden="true"></i>LOGOUT LIEN</p>
				          </div>
				        </div>
		          </div>
		        }
		        open={this.state.sidebarOpen}
		        onSetOpen={this.onSetSidebarOpen}
		        styles={sidebarStyles}
		      />

		      {
		      	this.state.logout ?
		      	<div className="logout_madal">
			      	<Modal
		              visible={this.state.logout}
		              width="80%"
		              height="300"
		              effect="fadeInUp"
		              onClickAway={() => this.handleClose()}
		             >
	              <div className="logout_modal_div">
	                <p className="logout_header">Log out?</p>
	                <p className="logout_content">Are you sure you want to log out of <b><i>{this.state.username}</i> ?</b> Doing this will keep all of your settings same.</p>
	                <div className="logout_madal_align">
	                	<button onClick={this.handleLogoutCancel}> CANCEL </button>
	                	<button onClick={this.handleLogoutSubmit}> LOG OUT </button>
	                </div>
	              </div>
	            </Modal>
            </div>

		      	: null
		      }
					<img className="search_bg" src="./images/search_bg.jpg" alt="login" />
					<div className="search_bar">
						<h3>{this.state.username}</h3>
						<p className="search_p">WHAT DO YOU <i>REALLY</i>FEEL LIKE ?</p>
						<form onSubmit={this.handleSubmit}>
							<div className="search_input">
								<button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button><input type="text" name="search" onChange={this.handleChange.bind(this)} placeholder="Search Food items or restaurants" />
							</div>
						</form>
					</div>
				</div>
				 <div className="navbar_bottom">
				    <Link to="/Search"><i className="click fa fa-search" aria-hidden="true"></i></Link>
				    <Link to="/MyFavorites"><i className="fa fa-star-o" aria-hidden="true"></i></Link>
				    <Link to="/AddDish"><i className="fa fa-plus-circle add_icon"></i></Link>
				    <Link to="/MyProfile"><i className="fa fa-user-o" aria-hidden="true"></i></Link>
				    <Link to="#"><i className="fa fa-cog" aria-hidden="true" onClick={() => this.onSetSidebarOpen(true)}></i></Link>
	        </div>
			</div>
		)
	}
}