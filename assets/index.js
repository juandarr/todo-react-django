import React, {StrictMode} from "../jstoolchains/node_modules/react";
import {createRoot} from "../jstoolchains/node_modules/react-dom/client";

import App from "./App.js";

const container = createRoot(document.getElementById('root'));
container.render(
    <StrictMode>
        <App />
    </StrictMode>
);