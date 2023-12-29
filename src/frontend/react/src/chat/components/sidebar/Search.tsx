import { useState } from "react";

const Search = () => {

    const [placeholder, setPlaceHolder] = useState("search");

    return (
        <div className="search">
          <input 
              type="text"
              onClick={() => setPlaceHolder("")}
              onBlur={() => setPlaceHolder("search")}
              placeholder={placeholder} />
          <i className="fa fa-search"></i>
        </div>
    )
}

export default Search