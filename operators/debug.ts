import { tap } from 'rxjs';

export const debug = <T>(name?: string) =>
	tap<T>(data => {
		name; // the name of the current breakpoint
		data; // the data; hover this to inspect
		debugger;
	})
;

export const step = debug;
