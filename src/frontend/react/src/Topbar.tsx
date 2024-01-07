import { useApi } from "./apiStore.tsx";
import { usecollapseSidebar } from "./collapseSidebar.tsx";

const Topbar = () => {
  const { setOpen, isOpen } = usecollapseSidebar();
  const { first_name, image } = useApi();

  return (
    <div id="content">
      <div className="topbar">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="full">
            <button
              type="button"
              id="sidebarCollapse"
              className="sidebar_toggle"
              onClick={() => setOpen(!isOpen)}
              onKeyDown={(event) => {
                if (event.key === " ") {
                  event.preventDefault();
                }
              }}
            >
              <i className="fa fa-bars"></i>
            </button>
            <div className="logo_section">
              {/* <a href="#Profile">
					<img className="img-responsive" src={image} alt="#" />
				</a> */}
            </div>
            <div className="right_topbar">
              <div className="icon_info">
                <ul>
                  <li className="icons_list">
                    <a href="#">
                      <i className="fa fa-power-off"></i>
                    </a>
                  </li>
                  <li className="user_list">
                    <img
                      className="img-responsive "
                      style={{ width: 30 }}
                      src={image}
                      alt="#"
                    />
                  </li>
                  <li className="user_list">
                    <a href="#Profile">
                      <span className="name_user">{first_name}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Topbar;
