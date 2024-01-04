import ApiDataProvider from "./ApiDataProvider";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useApi } from "./apiStore";

function Bars() {
	const {auth, twofa} = useApi();
	
  return (
	<div>
		{(auth === true || twofa === false) && <ApiDataProvider/>}
		<Sidebar />
		<Topbar />
	</div>
	);
}

export default Bars;