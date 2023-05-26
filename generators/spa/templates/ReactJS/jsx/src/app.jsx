import React from "react";
import * as ReactDOM from "react-dom";
import Items from "./components/Items";

ReactDOM.render(
	<React.StrictMode>
        <Items />
    </React.StrictMode>,
  document.getElementById("<%= namespace.toLowerCase() %><%= moduleName %>")
);