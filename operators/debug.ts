import { tap } from 'rxjs';

export const debug = <T>(prefix?: string) => tap<T>(data => {
    data; // hover this
    debugger;
});

export const step = debug;
