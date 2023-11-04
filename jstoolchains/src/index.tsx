import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const root = document.getElementById('root');

if (root !== null) {
	const container = createRoot(root);
	container.render(
		<StrictMode>
			<App />
		</StrictMode>
	);
}
