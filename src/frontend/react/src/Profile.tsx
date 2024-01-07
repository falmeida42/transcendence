// import { useEffect, useState } from 'react';
// import { Mapping } from './App';
import { useEffect, useState } from 'react';
import { useApi } from './apiStore';

interface User {
	id: string,
	username: string,
	userImage: string
}

function Profile() {
	
	const { user, first_name, last_name, login, email, image } = useApi();
	const [friends, setFriends] = useState<User[]>([])

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
     	 const token = urlParams.get('token');

		fetch(`http://localhost:3000/user/friends`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		})
		.then(async (response) => {
			if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.text();
			return data ? JSON.parse(data) : null;
		})
		.then((data) => {
			const mappedFriends = data.map((friend : any) => ({
				id: friend.id,
				username: friend.login,
				userImage: friend.image,
			  }));
		  
			  setFriends([...mappedFriends]);
		})
		.catch((error) => console.error("Fetch error:", error));

	}, []);


	return (
		<div className="middle-cont">
		<div className="container-fluid">
		   <div className="row column1">
			  <div className="col-md-2"></div>
			  <div className="col-md-8">
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
								<div className="profile_img"><img width="180" className="rounded-circle" src={image} alt="#" /></div>
								<div className="profile_contant">
								   <div className="contact_inner">
									  <h3>{first_name} {last_name}</h3>
									  <p><strong>Username: </strong>{login}</p>
									  <ul className="list-unstyled">
										 <li><i className="fa fa-envelope-o"></i> : {email}</li>
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
								   <button>
									Add Friend
								   </button>
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
												{
													friends.map((friend : User) => (
														<li>
														<span><img src={friend.userImage} className="img-responsive" alt="#"></img></span>
														<span>
														<span className="name_user">{friend.username}</span>
														</span>
												  		</li>
													))
												}
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
		</div>
	 </div>		
	)
}

export default Profile;