import { tap } from 'rxjs';

export const log = <T>(prefix?: string) => tap<T>(data => {
    console.log(prefix ? `${prefix}: ` : '', data);
});
