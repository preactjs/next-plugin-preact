import React, { lazy } from 'react';

const L = lazy(() => import('../lazy'));

export default function App() {
	return (
		<div>
            Hello world!
			<L />
		</div>
	);
}
