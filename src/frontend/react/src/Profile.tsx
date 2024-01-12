import { useEffect, useState } from 'react';
import { useApi } from './apiStore';
import useUpdateUserData from './UpdateUserData';
import Usetwofa from './Apiturnon';
import Qrcode from './Qrcode';
import Apiturnoff from './Apiturnoff';
import "./Profile.css";
import AddFriendPopup from './AddFriendPopUp';

interface User {
	id: string,
	username: string,
	userImage: string
}

function Profile() {

	const { user, first_name, last_name, login, email, image, twofa, setUsername, setImage } = useApi();

	/////////////// Username update /////////////////

	const [isEditing, setIsEditing] = useState(false);
	const [textValue, setTextValue] = useState(login);
	const [name, setName] = useState("");

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleSubmitClick = () => {
		setIsEditing(false);
		// You can add logic here to handle the submission of changes
		setUsername(textValue);
		updateFunction();
		// console.log('Submitted changes:', textValue);
	};

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTextValue(event.target.value);
	};


	/////////////// Image update /////////////////


	const [isEditingImage, setIsEditingImage] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | undefined>(image);

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

	const { updateFunction } = useUpdateUserData({
		updateFunction: () => ({
			username: textValue, // Assuming you want to update the username with the current textValue
			image: selectedImage,
		}),
	});

	const handleSubmitClickImage = () => {
		setIsEditingImage(false);
		// You can add logic here to handle the submission of the new image
		setImage(selectedImage);
		updateFunction();
		// console.log('Submitted new image:', selectedImage);
	};

	const handleClickCode = () => {
		Usetwofa({ code: name });
	};

	const [friends, setFriends] = useState<User[]>([])
	const [isVisibleAddFriend, setIsVisibleAddFriend] = useState(false);

	const handleClickAddFriend = () => {
		//console.log("Handle click add friend called")
		setIsVisibleAddFriend(!isVisibleAddFriend);
		//console.log(isVisibleAddFriend)
	};
	const token = document.cookie
		.split('; ')
		.find((row) => row.startsWith('token='))
		?.split('=')[1];
	if (token === undefined)
		return;
	
	useEffect(() => {
		// const urlParams = new URLSearchParams(window.location.search);


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
				const mappedFriends = data.map((friend: any) => ({
					id: friend.id,
					username: friend.login,
					userImage: friend.image,
				}));

				setFriends([...mappedFriends]);
			})
			.catch((error) => console.error("Fetch error:", error));

	}, []);

	return (
		<div className="container-fluid profile_container">
			<AddFriendPopup isVisible={isVisibleAddFriend} handleClose={handleClickAddFriend} token={token}/>
				<div className="profile_contant flex-item">
					<div className="form-group">
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
								</>
							) : (
								<>
									<div className="profile_img">
										<img
											style={{ maxHeight: 300 }}
											src={selectedImage || 'placeholder.jpg'}
											alt="Selected"
											className=" rounded-circle"
										/>
									</div>
									<button
										className="btn btn-outline-secondary ml-2"
										style={{ width: "fit-content" }}
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
						<button className="btn btn-secondary" onClick={handleSubmitClickImage}>
							Submit New Image
						</button>
					)}
				</div>
				<div className="profile_contant flex-item">
					<div className="contact_inner">
						<h3 className='mb-4'>{first_name} {last_name}</h3>
						<div className="">
							<div className="form-group" style={{ marginBottom: "4px" }}>
								<div className="input-group">
									<span className="mr-2" style={{ maxHeight: "20px" }}><p><strong>Username: </strong></p></span>
									<input
										type="text"
										id="textField"
										className="form-control"
										value={textValue}
										readOnly={!isEditing}
										onChange={handleTextChange}
										style={{ maxHeight: "25px", maxWidth: "200px" }}
									/>
									<div className="input-group-append" style={{ maxHeight: "25px" }}>
										<button
											className="btn btn-outline-secondary"
											type="button"
											style={{ maxHeight: "25px" }}
											onClick={handleEditClick}
										>
											<i className="fa fa-pencil green_color" style={{ verticalAlign: "super" }}> </i>
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

                			<p className='mb-4'><i className="fa fa-envelope-o"></i> : {email}</p>
            		
					<button className="btn btn-lg btn-secondary mr-2" onClick={handleClickAddFriend}>
						Enable 2FA
					</button>
					<button className="btn btn-lg btn-secondary mr-2" onClick={handleClickAddFriend}>
						Add Friend
					</button>


						<div className="user_progress_bar">
							<h2>
								<span className="skill">Match results (wins | losses)<span className="info_valume"></span></span>
								<div className="progress skill-bar">
									<div className="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" style={{ width: '75%' }}> <h5 style={{ textAlign: 'right', color: 'white', paddingRight: '4%', marginLeft: '-20px' }}>12</h5>
									</div>
									<h5 style={{ lineHeight: "30px", paddingLeft: '3%', marginRight: '-39px' }}>3</h5 >
								</div>
							</h2>
						</div>
					</div>

			</div>

			{/* <div className="full inner_elements margin_top_30">
				<div className="tab_style2">
					{twofa === false && <Qrcode />}
					<div className="user_progress_bar">
						{twofa === true && <Apiturnoff />}
						<h2>
							<span className="skill">Match results (wins | losses)<span className="info_valume"></span></span>
							<div className="progress skill-bar">
								<div className="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" style={{ width: '75%' }}> <h5 style={{ textAlign: 'right', color: 'white', paddingRight: '4%', marginLeft: '-20px' }}>12</h5>
								</div>
								<h5 style={{ lineHeight: "30px", paddingLeft: '3%', marginRight: '-39px' }}>3</h5 >
							</div>
						</h2>
					</div>

					</div>
				</div> */}
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
										friends.map((friend: User) => (
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
	)
}

export default Profile;
