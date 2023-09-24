import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const container = createRoot(document.getElementById('root') as HTMLElement);
container.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
