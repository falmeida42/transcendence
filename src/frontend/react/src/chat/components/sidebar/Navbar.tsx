
export const toggleNavBarVisibility = () => {
    const sideBar = (document.getElementById("sidebar") as HTMLDivElement);
    const sideBarVisibility = sideBar.style.visibility;

    sideBar.style.visibility = sideBarVisibility === "hidden" ? "visible" : "hidden";
}

const Navbar = () => {
    return (
        <div className="navbar" onClick={toggleNavBarVisibility}>
            <div className="user">
                <img src="https://www.42lisboa.com/wp-content/uploads/2020/07/42-Lisboa_RGB_Vertical.png" alt=""/>
                <span>Username</span>
            </div>
        </div>
    )
}

export default Navbar