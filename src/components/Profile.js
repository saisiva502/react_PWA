import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';

export default class Profile extends Component {
	constructor(props){
		super(props);

		this.state = {
			first_name: '',
			last_name: '',
			username: '',
			email: '',
			password: '',
			id: '',
			status: false,
			pic_upload: false,
			facing_mode: false,
			image_taken: false,
			image_uri: ''
		}

		this.handleProfileClose = this.handleProfileClose.bind(this);
		this.getUserData = this.getUserData.bind(this);
		this.handleUserDataChange = this.handleUserDataChange.bind(this);
		this.updateUserData = this.updateUserData.bind(this);
		this.picUpload = this.picUpload.bind(this);
		this.onTakePhoto = this.onTakePhoto.bind(this);

	}

	handleProfileClose(){
		this.props.history.push('/Search')
	}

	componentDidMount(){
		if(!localStorage.getItem('token')){
		  window.location.href = '/#/'
	  }
		// var name = localStorage.getItem('username')
		// this.setState({username: name})
		this.getUserData()
	}

	notify = (data, type) => {
		if(type==="success"){
		toast.success(data);
		}else{
			toast.error(data);
		}
	}


	getUserData(){
		var token = localStorage.getItem('token')
		axios.get('https://foodfie.herokuapp.com/api/v1/users/show', {headers:{Authorization: token}}).then(res =>{
			this.setState({id: res.data.user.id,first_name: res.data.user.first_name, last_name: res.data.user.last_name, username: res.data.user.username, email: res.data.user.email })
		})
	}

	handleUserDataChange(e){
		let change = {}
    change[e.target.name] = e.target.value
    this.setState(change)
	}

	picUpload(){
		// this.setState({ pic_upload: true })
		// console.log("user Clicked on pic upload")
	}

	onTakePhoto(dataUri){
		// console.log("Image Data", dataUri)
		this.setState({image_uri: dataUri, image_taken: true})
	}

	updateUserData(e){
		e.preventDefault();
		var token = localStorage.getItem('token')
		var data = {
			user: {
				first_name: this.state.first_name,
				last_name: this.state.last_name,
				email: this.state.email,
				password: this.state.password,
				username: this.state.username
			}
		}
		axios.put('https://foodfie.herokuapp.com/api/v1/users/'+ this.state.id +'', data, {headers: {Authorization: token}}).then(res =>{
			if(res.data.success === "Yes"){
				this.setState({status: true})
        localStorage.setItem("username", res.data.user.username)
				this.notify(res.data.message, "success")
			}else{
				this.setState({status: true})
				this.notify(res.data.message, "error")
			}
		})
	}


	render(){
		return(
			<div>
				<div className="res_block">
				  <img src='./images/add_dish.jpg' className="dish_image" width="100%" height="250px" alt="login" />
					<i className="user_icon fa fa-user-circle-o" ></i>
					<i onClick={this.handleProfileClose} className="back_icon fa fa-chevron-left"></i>
					<p className="profile_username"> {this.state.username}</p>
					{
						this.state.pic_upload ?
						<div className="dish_image">
			        <Camera
			          isImageMirror = {false} idealFacingMode = { this.state.facing_mode ? FACING_MODES.ENVIRONMENT : FACING_MODES.USER } onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
			        />
			      </div>

			      :
					  null
					}
				</div>
				<form onSubmit={this.updateUserData}>
        	<div align="left" className="from_align">
						<label>FIRST NAME</label><br/>
						<i className="fa fa-pencil" aria-hidden="true"></i><input type="text" value={this.state.first_name} name="first_name" onChange={this.handleUserDataChange} placeholder="Eg: SARKAR"  />
				  </div>

				  <div align="left" className="from_align">
						<label>LAST NAME</label><br/>
						<i className="fa fa-pencil" aria-hidden="true"></i><input type="text" value={this.state.last_name} name="last_name" onChange={this.handleUserDataChange} placeholder="Eg: SARKAR"  />
				  </div>

				  <div align="left" className="from_align">
						<label>USER NAME</label><br/>
						<i className="fa fa-user-o" aria-hidden="true"></i><input type="text" name="username" value={this.state.username} onChange={this.handleUserDataChange} placeholder="Eg: SARKAR@123"  />
				  </div>

				  <div align="left" className="from_align">
						<label>EMAIL</label><br/>
						<i className="fa fa-envelope-o" aria-hidden="true"></i><input type="email" name="email" value={this.state.email} onChange={this.handleUserDataChange} placeholder="Email" />
				  </div>

				  <div align="left" className="from_align">
						<label>PASSWORD</label><br/>
						<i className="fa fa-key" aria-hidden="true"></i><input type="password" name="password" value={this.state.password} onChange={this.handleUserDataChange} placeholder="Password" />
				  </div>

				  <div align="left" className="submit_align">
						<input className="form-control" type="submit" name="" value="UPDATE DETAILS" />
				  </div>
        </form>

        {
        	this.state.status ? <ToastContainer /> : null
        }
			</div>
		)
	}
}