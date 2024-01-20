import { useContext, useState } from "react";
import { navigate } from "wouter/use-location";
import AddFriendPopup from "./AddFriendPopUp";
import BlockPopup from "./BlockPopUp";
import MatchHistory from "./MatchHistory";
import "./Profile.css";
import { ProfileContext, updateBlockableUsers, updateUserFriends } from "./ProfileContext";
import ScoreBar from "./ScoreBar";
import TwoFaPopup from "./TwoFAPopup";
import useUpdateUserData from "./UpdateUserData";
import { useApi } from "./apiStore";

interface User {
  id: string;
  username: string;
  userImage: string;
  userLogin: string;
}

function Profile() {
  const {
    id,
    user,
    first_name,
    last_name,
    email,
    image,
    failToUpdate,
  } = useApi();

  /////////////// Username update /////////////////

  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState<string | undefined>(user);
  const [finalText, setfinalText] = useState<string | undefined>(undefined);
  const [finalImage, setfinalImage] = useState<string | undefined>(undefined);

  const checkCookie = () => {
    const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
    if (token === undefined) handleNavigate('00000000');
    return;
  }

  const handleEditClick = () => {
    checkCookie();
    setIsEditing(true);
  };

  const handleSubmitClick = () => {
    checkCookie();
    if (textValue) {
      const trimmedText = textValue.trim();
      if (trimmedText) {
        setfinalText(trimmedText);
        if (!failToUpdate) {
          setIsEditing(false);
        }
      }
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    checkCookie();
    setTextValue(event.target.value);
  };

  /////////////// Image update /////////////////

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(image);

  const handleEditClickImage = () => {
    checkCookie();
    setIsEditingImage(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    checkCookie();
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
    checkCookie();
    if (selectedImage) {
      setfinalImage(selectedImage);
      if (!failToUpdate) {
        setIsEditingImage(false);
      }
    }
  };

  useUpdateUserData({ username: finalText, image: finalImage });

  const handleNavigate = (friendId: string) => {
    navigate(`/Profile/${friendId}`);
  };

  const { userFriends } = useContext(ProfileContext) ?? {};
  const [isVisible2FA, setIsVisible2FA] = useState(false);
  const [isVisibleBlock, setIsVisibleBlock] = useState(false);
  const [isVisibleAddFriend, setIsVisibleAddFriend] = useState(false);

  const handleClickAddFriend = () => {
    updateUserFriends()
    checkCookie();
    if (isVisible2FA) {
      setIsVisible2FA(!isVisible2FA);
    }
    if (isVisibleBlock) {
      setIsVisibleBlock(!isVisibleBlock);
    }
    setIsVisibleAddFriend(!isVisibleAddFriend);
  };

  const handleClick2FA = () => {
    checkCookie();
    if (isVisibleBlock) {
      setIsVisibleBlock(!isVisibleBlock);
    }
    if (isVisibleAddFriend) {
      setIsVisibleAddFriend(!isVisibleAddFriend);
    }
    setIsVisible2FA(!isVisible2FA);
  };

  const handleClickBlock = () => {
    updateBlockableUsers()
    checkCookie();
    if (isVisibleAddFriend) {
      setIsVisibleAddFriend(!isVisibleAddFriend);
    }
    if (isVisible2FA) {
      setIsVisible2FA(!isVisible2FA);
    }
    setIsVisibleBlock(!isVisibleBlock);
  };

  return (
    <div className="container-fluid profile_container">
      <AddFriendPopup
        isVisible={isVisibleAddFriend}
        handleClose={handleClickAddFriend}
      />
      <TwoFaPopup
        isVisible={isVisible2FA}
        handleClose={handleClick2FA}
      />
      <BlockPopup
        isVisible={isVisibleBlock}
        handleClose={handleClickBlock}
      />
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
                    src={
                      !isEditingImage && !selectedImage ? image : selectedImage
                    }
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
                  <i className="fa fa-pencil green_color "> </i>
                </button>
              </>
            )}
          </div>
        </div>

        {isEditingImage && (
          <button
            className="btn btn-secondary"
            onClick={handleSubmitClickImage}
          >
            Submit New Image
          </button>
        )}
      </div>
      <div className="profile_contant flex-item">
        <div className="contact_inner">
          <h3 className="mb-4">
            {first_name} {last_name}
          </h3>
          <div className="">
            <div className="form-group" style={{ marginBottom: "4px" }}>
              <div className="input-group">
                <span className="mr-2" style={{ maxHeight: "20px" }}>
                  <p>
                    <strong>Username: </strong>
                  </p>
                </span>
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
                <div
                  className="input-group-append"
                  style={{ maxHeight: "25px" }}
                >
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    style={{ maxHeight: "25px" }}
                    onClick={handleEditClick}
                  >
                    <i
                      className="fa fa-pencil green_color"
                      style={{ verticalAlign: "super" }}
                    >
                      {" "}
                    </i>
                  </button>
                </div>
              </div>
              {failToUpdate && (
                <div
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    padding: "8px 50px",
                  }}
                >
                  Username already exists!
                </div>
              )}
            </div>

            {isEditing && (
              <button
                className="btn btn-secondary btn-sm mb-2"
                onClick={handleSubmitClick}
              >
                Submit Changes
              </button>
            )}
          </div>

          <p className="mb-4">
            <i className="fa fa-envelope-o"></i> : {email}
          </p>

          <button
            className="btn btn-lg btn-secondary mr-2 mb-1"
            onClick={handleClick2FA}
          >
            Manage 2FA
          </button>
          <button
            className="btn btn-lg btn-secondary mr-2 mb-1"
            onClick={handleClickAddFriend}
          >
            Add Friend
          </button>
          <button
            className="btn btn-lg btn-secondary mr-2 mb-1"
            onClick={handleClickBlock}
          >
            Block User
          </button>
          <p style={{ paddingTop: "20px" }} />
          <ScoreBar id={id} />
        </div>
      </div>

      <div className="tabbar">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a
              className="nav-item nav-link active"
              id="nav-home-tab"
              data-toggle="tab"
              href="#recent_activity"
              role="tab"
              aria-selected="true"
            >
              Match History
            </a>
            <a
              className="nav-item nav-link"
              id="nav-profile-tab"
              data-toggle="tab"
              href="#project_worked"
              role="tab"
              aria-selected="false"
              onClick={updateUserFriends}
            >
              Friend List
            </a>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <MatchHistory id={id} />
          <div
            className="tab-pane fade"
            id="project_worked"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
          >
            <div className="msg_list_main">
              <ul className="msg_list">
                {userFriends.map((friend: User) => (
                  <li key={friend.id}>
                    <span>
                      <a
                        onClick={() => {
                          handleNavigate(friend.userLogin);
                        }}
                      >
                        <img
                          src={friend.userImage}
                          className="img-responsive"
                          alt="#"
                        ></img>
                      </a>
                    </span>
                    <span>
                      <span className="name_user">{friend.username}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
