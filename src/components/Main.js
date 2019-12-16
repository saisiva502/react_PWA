import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import LoginForm from './LoginForm';
import Register from './Register';
import Search from './Search';
import axios from 'axios'
import { Link, HashRouter } from "react-router-dom";
// import { FacebookLogin } from 'react-facebook-login-component';



export default class Main extends Component {
  constructor(props){
  	super(props);
  	this.state = {
  		login_show: false,
  	}
  }

  handlePress(e){
  	if(e === 1){
  		this.setState({login_show: true})
  	}else{
  		this.setState({login_show: false})
  	}
  }

  responseFacebook = (response) => {
    console.log(response);

    var data = {
      provider: "facebook",
      uid: response.userID,
      username: response.name,
      device_id: response.accessToken,
      user:{
        email: response.email
      }

    }
    axios.post('https://foodfie.herokuapp.com/api/v1/authentications', data).then(res=>{
      localStorage.setItem("token", res.data.user.authentication_token)
      localStorage.setItem("username", res.data.user.username)

      if(res.data.user.authentication_token){
        window.location.href = '/Search'
      }
    })
  }

	render(){
		return(
      <div>
        {
          localStorage.getItem("token") ? <Search /> :
      			<div className="index_block">
      				<div className="row">
      					<div className="col-md-6 col-lg-6 col-sm-6">
      						<p className="index_header">Oh hi, you're new here.</p>
      					</div>
      					<div className="col-sm-6 col-lg-6 col-md-6">
                  <HashRouter>
        					  <Link onClick={()=>this.handlePress(1)} to="#">CREATE ACCOUNT</Link>
        					  <Link onClick={()=>this.handlePress(0)} to="#">LOGIN</Link>
                  </HashRouter>
      					</div>
      				</div>
              <div className="background_image_login">
                <img src="./images/login_bg.jpg"  width="100%" height="auto" alt="login" />
                <FacebookLogin
                  appId="625016881357319"
                  fields="name,email,picture"
                  callback={this.responseFacebook}
                  cssClass="btnFacebook"
                  // xfbml={true}
                  icon={<i className="fa fa-facebook" style={{marginLeft:'5px'}}>
                  </i>}
                  textButton = "&nbsp;&nbsp; USE FACEBOOK TO MAKE ACCOUNT"
                  disableMobileRedirect={true}
                />
              </div>
              {
              	this.state.login_show ? <Register /> : <LoginForm />
              }
      			</div>
        }
      </div>
		)
	}
}