import { useApi } from "./apiStore.tsx";
import { usecollapseSidebar } from "./collapseSidebar.tsx";

const Sidebar = () => {
	
  const { user, first_name, last_name, login, email, image } = useApi();
  const { isOpen } = usecollapseSidebar();

  return (
    <nav id="sidebar" className = {isOpen ? "" : "active"}>

      <div className="sidebar_blog_1">
        <div className="sidebar-header">
          <div className="logo_section">
            {/* <a href="">
              <img
                className="logo_icon img-responsive"
                src={image}
                alt="#"
              />
            </a> */}
          </div>
        </div>
        <div className="sidebar_user_info">
          <div className="icon_setting"></div>
          <div className="user_profle_side">
            <div className="user_img">
              <img className="img-responsive" src="" alt="USER IMG" />
            </div>
            <div className="user_info">
              <h6>{first_name}</h6>
              <p>
                <span className="online_animation"></span> Online
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar_blog_2">
        <h4>Menu</h4>
        <ul className="list-unstyled components">
          <li>
            <a href="#Profile">
              <i className="fa fa-user green_color"></i> <span>Profile</span>
            </a>
          </li>
          <li>
            <a href="#Game">
              <i className="fa fa-gamepad orange_color"></i> <span>Game</span>
            </a>
          </li>
          <li>
            <a href="#Friends">
              <i className="fa fa-users purple_color2"></i> <span>Friends</span>
            </a>
          </li>
          <li>
            <a href="#Chat">
              <i className="fa fa-paper-plane red_color"></i> <span>Chat</span>
            </a>
          </li>
          <li>
            <a href="#Settings">
              <i className="fa fa-cog yellow_color"></i> <span>Settings</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
