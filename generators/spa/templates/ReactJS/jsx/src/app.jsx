import React from "react";
import { createRoot } from 'react-dom/client';
import Items from "./components/Items";

const container = document.getElementById("<%= namespace.toLowerCase() %><%= moduleName %>")

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Items />
  </React.StrictMode>,
);