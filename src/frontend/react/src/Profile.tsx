import { useState } from 'react';

// import { Mapping } from './App';
import { useApi } from './apiStore';

export var token: string | null;

function Profile() {
	
	const { user, first_name, last_name, login, email, image } = useApi();
	

	/////////////// Username update /////////////////

	const [isEditing, setIsEditing] = useState(false);
	const [textValue, setTextValue] = useState(login);
	
	const handleEditClick = () => {
		setIsEditing(true);
	};
	
	const handleSubmitClick = () => {
		setIsEditing(false);
		// You can add logic here to handle the submission of changes
		console.log('Submitted changes:', textValue);
	};
	
	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTextValue(event.target.value);
	};


	/////////////// Image update /////////////////


	const [isEditingImage, setIsEditingImage] = useState(false);
  	const [selectedImage, setSelectedImage] = useState<string | null>(image);

	const handleEditClickImage = () => {
		setIsEditingImage(true);
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];

		if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			setSelectedImage(e.target?.result as string);
		};
		reader.readAsDataURL(file);
		}
	};

	const handleSubmitClickImage = () => {
		setIsEditingImage(false);
		// You can add logic here to handle the submission of the new image
		console.log('Submitted new image:', selectedImage);
	};


	return (
		// <div className="middle-cont">
		<div className="container-fluid profile_container">
		   <div className="row column1">
			  {/* <div className="col-md-2"></div>
			  <div className="col-md-8"> */}
				 <div className="white_shd full margin_bottom_30">
					<div className="full graph_head">
					   <div className="heading1 margin_0">
						  <h2>User profile</h2>
					   </div>
					</div>
					<div className="full price_table padding_infor_info">
					   <div className="row">
						  <div className="col-lg-12">
							 <div className="full dis_flex center_text">

								{/* <div className="profile_img"><img width="180" className="rounded-circle" src={image} alt="#" /></div> */}
								<div className="container flex-item">
									<div className="form-group">
										{/* <label htmlFor="imageField">Image:</label> */}
										<div className="input-group d-flex flex-column">
										{isEditingImage ? (
											<>
											<input
												type="file"
												id="imageField"
												className="form-control-file"
												accept="image/*"
												onChange={handleImageChange}
											/>
											{/* <div className="input-group-append">
												<button
												className="btn btn-outline-secondary"
												type="button"
												style={{width: "fit-content"}}
												onClick={handleEditClickImage}
												>
												<i className="fa fa-pencil green_color " style={{}}> </i>
												</button>
											</div> */}
											</>
										) : (
											<>
											<div className="profile_img">

											<img
												//width="180"
												//height="300"
												style={{maxHeight: 300}}
												src={selectedImage || 'placeholder.jpg'}
												alt="Selected"
												className=" rounded-circle"
											/>
											</div>
											<button
												className="btn btn-outline-secondary ml-2"
												style={{width: "fit-content"}}
												type="button"
												onClick={handleEditClickImage}
											>
												<i className="fa fa-pencil green_color " > </i>
											</button>
											</>
										)}
										</div>
									</div>

									{isEditingImage && (
										<button className="btn btn-primary" onClick={handleSubmitClickImage}>
										Submit New Image
										</button>
									)}
									</div> 


								<div className="profile_contant flex-item">
								   <div className="contact_inner">
									  <h3>{first_name} {last_name}</h3>


									  <div className="">
										<div className="form-group" style={{marginBottom: "4px"}}>
											{/* <label htmlFor="textField">Username:</label> */}
											<div className="input-group">
											<span className="mr-2" style={{maxHeight: "20px"}}><p><strong>Username: </strong></p></span>
											<input
												type="text"
												id="textField"
												className="form-control"
												value={textValue}
												readOnly={!isEditing}
												onChange={handleTextChange}
												style={{maxHeight: "25px",  maxWidth: "200px"}}
											/>
											<div className="input-group-append" style={{maxHeight: "25px"}}>
												<button
												className="btn btn-outline-secondary"
												type="button"
												style={{maxHeight: "25px"}}
												onClick={handleEditClick}
												>
												<i className="fa fa-pencil green_color " style={{verticalAlign: "super"}}> </i>
												</button>
											</div>
											</div>
										</div>

										{isEditing && (
											<button className="btn btn-secondary btn-sm mb-2" onClick={handleSubmitClick}>
											Submit Changes
											</button>
										)}
										</div>


										
										{/* <div className="">
											<span className="mr-2"><p><strong>Username: </strong>{login}</p></span>
									  		<i className="fa fa-pencil green_color "> </i>
										</div> */}
									  <ul className="list-unstyled">
										 <li><i className="fa fa-envelope-o"></i> : {email}</li>
										 <li><i className="fa fa-phone"></i> : 987 654 3210</li>
									  </ul>
								   </div>
								   <div className="user_progress_bar">
									<h2>
										 <span className="skill">Match results (wins | losses)<span className="info_valume"></span></span>                   
										 <div className="progress skill-bar">
											<div className="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" style={{ width: '75%'}}> <h5 style={{textAlign: 'right', color: 'white', paddingRight: '4%', marginLeft: '-20px'}}>12</h5>
											</div>
											<h5 style={{lineHeight: "30px", paddingLeft: '3%', marginRight: '-39px'}}>3</h5 >
										 </div>
									</h2>
								   </div>
								</div>
							 </div>
							 <div className="full inner_elements margin_top_30">
								<div className="tab_style2">
								   <div className="tabbar">
									  <nav>
										 <div className="nav nav-tabs" id="nav-tab" role="tablist">
											<a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#recent_activity" role="tab" aria-selected="true">Match History</a>
											<a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#project_worked" role="tab" aria-selected="false">Friend List</a>
										 </div>
									  </nav>
									  <div className="tab-content" id="nav-tabContent">
										 <div className="tab-pane fade show active" id="recent_activity" role="tabpanel" aria-labelledby="nav-home-tab">
											<div className="msg_list_main">
											   <ul className="msg_list">
												  <li>
													 <span><img src="images/layout_img/msg2.png" className="img-responsive" alt="#"></img></span>
													 <span>
													 <span className="name_user">Win against Taison Jack</span>
													 <span className="msg_user">11-4</span>
													 <span className="time_ago">12 min ago</span>
													 </span>
												  </li>
												  <li>
													 <span><img src="images/layout_img/msg3.png" className="img-responsive" alt="#"></img></span>
													 <span>
													 <span className="name_user">Loss against Mike John</span>
													 <span className="msg_user">1-7</span>
													 <span className="time_ago">12 min ago</span>
													 </span>
												  </li>
											   </ul>
											</div>
										 </div>
										 <div className="tab-pane fade" id="project_worked" role="tabpanel" aria-labelledby="nav-home-tab">
											<div className="msg_list_main">
											   <ul className="msg_list">
												  <li>
													 <span><img src="images/layout_img/msg2.png" className="img-responsive" alt="#"></img></span>
													 <span>
													 <span className="name_user">Taison Jack</span>
													 <span className="msg_user">Friend since: 1914</span>
													 <span className="time_ago">online: 12 min ago</span>
													 </span>
												  </li>
												  <li>
													 <span><img src="images/layout_img/msg3.png" className="img-responsive" alt="#"></img></span>
													 <span>
													 <span className="name_user">Mike John</span>
													 <span className="msg_user">Friend since: 2012</span>
													 <span className="time_ago">online: 12 min ago</span>
													 </span>
												  </li>
											   </ul>
											</div>
										 </div>								  
										</div>
								   </div>
								</div>
							 </div>
						  </div>
					   </div>
					</div>
				 </div>
				 <div className="col-md-2"></div>
			  </div>
		   </div>
		// </div>
	//  </div>		
	)
}

export default Profile;