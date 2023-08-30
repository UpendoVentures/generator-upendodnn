import React from "react";
import ReactDOM from 'react-dom/client';
import Hello from "./components/Hello";

const container = document.getElementById("<%= namespaceRoot.toLowerCase() %><%= friendlyName %>")

const root = ReactDOM.createRoot(container);
root.render(
	<div className="row">
	<div className="col-xs-12">
		<Hello name="I am a TypeScript react module" />
	</div>
</div>,
);