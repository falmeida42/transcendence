import { usecollapseSidebar } from "./collapseSidebar.tsx";
import { useApi } from "./apiStore.tsx";

const Topbar = () => {
	
	const { setOpen, isOpen } = usecollapseSidebar();
	const { user, first_name, last_name, login, email, image } = useApi();

	return (
		<div id="content">
		<div className="topbar">
		<nav className="navbar navbar-expand-lg navbar-light">
			<div className="full">
			<button type="button" id="sidebarCollapse" className="sidebar_toggle" onClick={() => setOpen(!isOpen)} onKeyDown={(event) => {if(event.key===' '){event.preventDefault()}}}>
				<i className="fa fa-bars"></i>
			</button>
			<div className="logo_section">
				<a href="#Profile">
					<img className="img-responsive" src={image} alt="#" />
				</a>
			</div>
			<div className="right_topbar">
				<div className="icon_info">
				<ul>
					{/* <li>
					<a href="#">
						<i className="fa fa-bell-o"></i>
						<span className="badge">2</span>
					</a>
					</li>
					<li>
					<a href="#">
						<i className="fa fa-question-circle"></i>
					</a>
					</li>
					<li>
					<a href="#">
						<i className="fa fa-envelope-o"></i>
						<span className="badge">3</span>
					</a>
					</li> */}
				</ul>
				</div>
				<ul className="user_profile_dd">
					<li>
					<a className="dropdown-toggle" data-toggle="dropdown">
						<img className="img-responsive rounded-circle" style={{width: 30}} src={image} alt="#" />
						<span className="name_user">{first_name}</span>
					</a>
					<div className="dropdown-menu">
						<a className="dropdown-item" href="#Profile">
						My Profile
						</a>
						<a className="dropdown-item" href="#Settings">
						Settings
						</a>
						<a className="dropdown-item" href="#Help">
						Help
						</a>
						<a className="dropdown-item" href="#">
						<span>Log Out</span> <i className="fa fa-sign-out"></i>
						</a>
					</div>
					</li>
				</ul>
			</div>
			</div>
		</nav>
		</div>	
	</div>
	);
}

export default Topbar;