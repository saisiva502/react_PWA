import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Register extends Component {

	constructor(props){
		super(props);

		this.handleRegister = this.handleRegister.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.state = {
			username: '',
			email: '',
			password: '',
			first_name: '',
			confirm_password: '',
			error: false
		}
	}


	notify = (data) => toast.error(data)

	componentDidMount(){
	  if(!localStorage.getItem('token')){
		window.location.href = '/#/'
	  }
	}

	handleChange(e) {
    let change = {}
    change[e.target.name] = e.target.value
    this.setState(change)
  }
	handleRegister(event){
		event.preventDefault();
		if (this.state.password === this.state.confirm_password) {
			var data = {
				user: {
				  first_name: this.state.first_name,
				  username: this.state.username,
				  email: this.state.email,
				  password:this.state.password
				}
			}
			axios.post('https://foodfie.herokuapp.com/api/v1/signup', data ).then(res => {
				if(res.data.errors){
					// console.log(res.data.errors[0])
					this.setState({error: true })
					this.notify(res.data.errors[0])
				}
	      if(res.data.user){
	      	localStorage.setItem("token", res.data.user.authentication_token)
	      	localStorage.setItem("username", res.data.user.username)
	      	// console.log(localStorage.getItem('token'))
	      	setTimeout(function(){
	      		window.location.href = "/Search"
	      	}, 3000)
	      	this.setState({error: true })
	        this.confirm_reg("Successfully registered with Foodfie")
	      }else{
	      	event.preventDefault();
	      }
	    }).catch(err =>{
	    	// console.log(err)
	    })
		}else{
			alert("Passwords doesn't matched, check it once....!!!")
		}
	}

	confirm_reg = (data) => toast.info(data)

	render(){
		return(
		<div>
				{
					this.state.error ?
					<ToastContainer /> : null
				}
        <form onSubmit={this.handleRegister}>
        	<div align="left" className="from_align">
						<label>FULL NAME</label><br/>
						<i className="fa fa-pencil" aria-hidden="true"></i><input type="text" name="first_name" onChange={this.handleChange.bind(this)} placeholder="Eg: SARKAR" required />
				  </div>

				  <div align="left" className="from_align">
						<label>USER NAME</label><br/>
						<i className="fa fa-user-o" aria-hidden="true"></i><input type="text" name="username" onChange={this.handleChange.bind(this)} placeholder="Eg: SARKAR@123" required />
				  </div>

				  <div align="left" className="from_align">
						<label>EMAIL</label><br/>
						<i className="fa fa-envelope-o" aria-hidden="true"></i><input type="email" name="email" onChange={this.handleChange.bind(this)} placeholder="Email" required/>
				  </div>

				  <div align="left" className="from_align">
						<label>PASSWORD</label><br/>
						<i className="fa fa-key" aria-hidden="true"></i><input type="password" name="password" onChange={this.handleChange.bind(this)} placeholder="Password" required/>
				  </div>

				   <div align="left" className="from_align">
						<label>CONFIRM PASSWORD</label><br/>
						<i className="fa fa-check" aria-hidden="true"></i><input type="password" name="confirm_password" onChange={this.handleChange.bind(this)} placeholder="Confirm-Password" required/>
				  </div>

				   <div align="left" className="submit_align">
						<input className="form-control" type="submit" name="" value="REGISTER" />
				  </div>
        </form>

			</div>
		)
	}
}