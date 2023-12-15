import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import App from './App';
import './CSS/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<NextUIProvider>
		<main className="base text-foreground bg-background">
			<App />
		</main>
	</NextUIProvider>
);
