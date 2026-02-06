/**
 * Switch to another stream when anything is received
 * 
 * N.B.: Just like switchMap, this will cause the supplied stream to be restarted
 */
export const switchTo = <T>(target: Observable<T>) =>
	switchMap(() => target)
;

