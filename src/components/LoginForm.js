import React, { Component } from 'react';
// import $ from 'jquery';
import axios from 'axios';
// import Search from './Search';
// import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class LoginForm extends Component {
	constructor(props){
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.state = {
			email: '',
			password: '',
			auth: false,
			error: false
		}
	}

	notify = (data) => toast.error(data)

	handleChange(e) {
    let change = {}
    change[e.target.name] = e.target.value
    this.setState(change)
  }

	handleLogin(event){
		event.preventDefault();
		var data = {
			user: {
			  username: this.state.email,
			  password:this.state.password
			}
		}
		axios.post('https://foodfie.herokuapp.com/api/v1/signin', data ).then(res => {
			if(res.data.message){
				this.setState({ error: true})
				this.notify(res.data.message)
			}
      if(res.data.user){
      	// console.log("###########", res)
      	localStorage.setItem("token", res.data.user.authentication_token)
        localStorage.setItem("username", res.data.user.first_name)
        localStorage.setItem("current_user", res.data.user.id)
      	window.location.href = "/Search"
      }
      // else{
      // 	window.location.href = "/"
      // }
    })
	}


	render(){
		return(
			<div>
			  {
					this.state.error ?
					<ToastContainer /> : null
				}
				<div className="index_block">
	        <form onSubmit={this.handleLogin}>
					  <div align="left" className="from_align">
							<label>USER NAME OR EMAIL</label><br/>
							<i className="fa fa-envelope-o" aria-hidden="true"></i><input type="email" name="email" onChange={this.handleChange.bind(this)} placeholder="Email" required/>
					  </div>

					  <div align="left" className="from_align">
							<label>PASSWORD</label><br/>
							<i className="fa fa-key" aria-hidden="true"></i><input type="password" name="password" onChange={this.handleChange.bind(this)} placeholder="Password" required/>
					  </div>

					  <div align="left" className="submit_align">
							<input className="form-control" type="submit" name="" value="LOG IN" />
					  </div>
	        </form>
				</div>
			</div>
		)
	}
}