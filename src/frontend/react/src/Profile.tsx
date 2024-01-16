import { useContext, useEffect, useState } from 'react';
import { useApi } from './apiStore';
import useUpdateUserData from './UpdateUserData';
import "./Profile.css";
import AddFriendPopup from './AddFriendPopUp';
import { ProfileContext, updateUserFriends } from './ProfileContext';
import TwoFaPopup from './TwoFAPopup';
import getHookers from "./Hookers";
import MatchHistory from "./MatchHistory";
import BlockPopup from './BlockPopUp';
import ScoreBar from './ScoreBar';
import FriendProfile from './FriendProfile';

interface User {
	id: string,
	username: string,
	userImage: string,
}

function Profile() {
	const {
		id,
		user,
		first_name,
		last_name,
		login,
		email,
		image,
		twofa,
		auth,
		setUsername,
		setImage,
	} = useApi();
	//   const {isLoading, serverError, apiData} = getHookers(`/user/matches/${id}`)

	// console.log(isLoading);

	/////////////// Username update /////////////////

	const [isEditing, setIsEditing] = useState(false);
	const [textValue, setTextValue] = useState<string | undefined>(user);

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleSubmitClick = () => {
		if (textValue) {
			setIsEditing(false);
			setUsername(textValue);
		}
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

	const handleSubmitClickImage = () => {
		if (selectedImage) {
			setIsEditingImage(false);
			setImage(selectedImage);
		}
	};

	const { userFriends } = useContext(ProfileContext) ?? {};
	const [isVisibleAddFriend, setIsVisibleAddFriend] = useState(false);
	const [isVisible2FA, setIsVisible2FA] = useState(false);
	const [isVisibleBlock, setIsVisibleBlock] = useState(false);

	const handleClickAddFriend = () => {
		if (isVisible2FA) {
			setIsVisible2FA(!isVisible2FA);
		}
		if (isVisibleBlock) {
			setIsVisibleBlock(!isVisibleBlock);
		}
		setIsVisibleAddFriend(!isVisibleAddFriend);
	};

	const handleClick2FA = () => {
		if (isVisibleBlock) {
			setIsVisibleBlock(!isVisibleBlock);
		}
		if (isVisibleAddFriend) {
			setIsVisibleAddFriend(!isVisibleAddFriend);
		}
		setIsVisible2FA(!isVisible2FA);
	};

	const handleClickBlock = () => {
		if (isVisibleAddFriend) {
			setIsVisibleAddFriend(!isVisibleAddFriend);
		}
		if (isVisible2FA) {
			setIsVisible2FA(!isVisible2FA);
		}
		setIsVisibleBlock(!isVisibleBlock);
	};

	const token = document.cookie
		.split('; ')
		.find((row) => row.startsWith('token='))
		?.split('=')[1];
	if (token === undefined)
		return;

	useUpdateUserData({ username: textValue, image: selectedImage });

	return (
		<div className="container-fluid profile_container">
			<AddFriendPopup isVisible={isVisibleAddFriend} handleClose={handleClickAddFriend} token={token} />
			<TwoFaPopup isVisible={isVisible2FA} handleClose={handleClick2FA} token={token} />
			<BlockPopup isVisible={isVisibleBlock} handleClose={handleClickBlock} token={token} />
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
										src={!isEditingImage && !selectedImage ? image : selectedImage}
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
									maxLength={12}
									value={!isEditing && !textValue ? user : textValue}
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

					<button className="btn btn-lg btn-secondary mr-2 mb-1" onClick={handleClick2FA}>
						Manage 2FA
					</button>
					<button className="btn btn-lg btn-secondary mr-2 mb-1" onClick={handleClickAddFriend}>
						Add Friend
					</button>
					<button className="btn btn-lg btn-secondary mr-2 mb-1" onClick={handleClickBlock}>
						Block User
					</button>
					<div style={{ paddingTop: `20px` }}>
						<ScoreBar id={id} />
					</div>
				</div>

			</div>

			<div className="tabbar">
				<nav>
					<div className="nav nav-tabs" id="nav-tab" role="tablist">
						<a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#recent_activity" role="tab" aria-selected="true">Match History</a>
						<a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#project_worked" role="tab" aria-selected="false">Friend List</a>
					</div>
				</nav>
				<div className="tab-content" id="nav-tabContent">
					<MatchHistory id={id} />
					<div className="tab-pane fade" id="project_worked" role="tabpanel" aria-labelledby="nav-home-tab">
						<div className="msg_list_main">
							<ul className="msg_list">

								{
									userFriends.map((friend: User) => (
										<li key={friend.id}>
											<span ><img src={friend.userImage} className="img-responsive" alt="#" ></img></span>
											<span>
												<span className="name_user" >{friend.username}</span>
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
