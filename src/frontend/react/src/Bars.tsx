import ApiDataProvider from "./ApiDataProvider";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useApi } from "./apiStore";

function Bars() {
	const {auth} = useApi();
	
  return (
	<div>
		{auth === true && <ApiDataProvider/>}
		<Sidebar />
		<Topbar />
	</div>
	);
}

export default Bars;