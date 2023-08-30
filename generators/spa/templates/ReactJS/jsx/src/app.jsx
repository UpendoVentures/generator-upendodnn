import React from "react";
import { createRoot } from 'react-dom/client';
import Items from "./components/Items";

const container = document.getElementById("<%= namespaceRoot.toLowerCase() %><%= friendlyName %>")

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Items />
  </React.StrictMode>,
);