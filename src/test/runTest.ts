import {run} from "./suite/index";

(function() {
	try {
		run();
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
})();
