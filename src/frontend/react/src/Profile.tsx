function Profile() {
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
								<div className="profile_img"><img width="180" className="rounded-circle" src="images/layout_img/user_img.jpg" alt="#" /></div>
								<div className="profile_contant">
								   <div className="contact_inner">
									  <h3>John Smith</h3>
									  <p><strong>About: </strong>Frontend Developer</p>
									  <ul className="list-unstyled">
										 <li><i className="fa fa-envelope-o"></i> : test@gmail.com</li>
										 <li><i className="fa fa-phone"></i> : 987 654 3210</li>
									  </ul>
								   </div>
								   <div className="user_progress_bar">
									  <div className="progress_bar">
										 <span className="skill">Web Applications <span className="info_valume">85%</span></span>                   
										 <div className="progress skill-bar ">
											<div className="progress-bar progress-bar-animated progress-bar-striped" role="progressbar">
											</div>
										 </div>
										 <span className="skill">Website Design <span className="info_valume">78%</span></span>   
										 <div className="progress skill-bar">
											<div className="progress-bar progress-bar-animated progress-bar-striped" role="progressbar">
											</div>
										 </div>
										 <span className="skill">Automation & Testing <span className="info_valume">47%</span></span>
										 <div className="progress skill-bar">
											<div className="progress-bar progress-bar-animated progress-bar-striped" role="progressbar">
											</div>
										 </div>
										 <span className="skill">UI / UX <span className="info_valume">65%</span></span>
										 <div className="progress skill-bar">
											<div className="progress-bar progress-bar-animated progress-bar-striped" role="progressbar">
											</div>
										 </div>
									  </div>
								   </div>
								</div>
							 </div>
							 <div className="full inner_elements margin_top_30">
								<div className="tab_style2">
								   <div className="tabbar">
									  <nav>
										 <div className="nav nav-tabs" id="nav-tab" role="tablist">
											<a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#recent_activity" role="tab" aria-selected="true">Recent Activity</a>
											<a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#project_worked" role="tab" aria-selected="false">Projects Worked on</a>
											<a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#profile_section" role="tab" aria-selected="false">Profile</a>
										 </div>
									  </nav>
									  <div className="tab-content" id="nav-tabContent">
										 <div className="tab-pane fade show active" id="recent_activity" role="tabpanel" aria-labelledby="nav-home-tab">
											<div className="msg_list_main">
											   <ul className="msg_list">
												  <li>
													 <span><img src="images/layout_img/msg2.png" className="img-responsive" alt="#"></img></span>
													 <span>
													 <span className="name_user">Taison Jack</span>
													 <span className="msg_user">Sed ut perspiciatis unde omnis.</span>
													 <span className="time_ago">12 min ago</span>
													 </span>
												  </li>
												  <li>
													 <span><img src="images/layout_img/msg3.png" className="img-responsive" alt="#"></img></span>
													 <span>
													 <span className="name_user">Mike John</span>
													 <span className="msg_user">On the other hand, we denounce.</span>
													 <span className="time_ago">12 min ago</span>
													 </span>
												  </li>
											   </ul>
											</div>
										 </div>
										 <div className="tab-pane fade" id="project_worked" role="tabpanel" aria-labelledby="nav-profile-tab">
											<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et 
											   quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos 
											   qui ratione voluptatem sequi nesciunt.
											</p>
										 </div>
										 <div className="tab-pane fade" id="profile_section" role="tabpanel" aria-labelledby="nav-contact-tab">
											<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et 
											   quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos 
											   qui ratione voluptatem sequi nesciunt.
											</p>
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