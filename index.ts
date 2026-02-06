import { Observable, Observer, Subject, BehaviorSubject, OperatorFunction, merge } from "rxjs";

export class Stream<I, O = I> extends Observable<O> implements Observer<I> {
  private readonly input: Subject<I>;
  private readonly output$: Observable<O>;

  constructor();
  constructor(initial: I);
  constructor(initial?: I) {
    const input =
      arguments.length === 0
        ? new Subject<I>()
        : new BehaviorSubject<I>(initial as I);

    super(subscriber => input.subscribe(subscriber));

    this.input = input;
    this.output$ = input as unknown as Observable<O>;
  }

  private static fromInternal<I, O>(
    input: Subject<I>,
    output$: Observable<O>
  ): Stream<I, O> {
    const s = Object.create(Stream.prototype) as Stream<I, O>;
    Observable.call(s, subscriber => output$.subscribe(subscriber));
    s.input = input;
    s.output$ = output$;
    return s;
  }

  next(value: I): void {
    this.input.next(value);
  }

  error(err: any): void {
    this.input.error(err);
  }

  complete(): void {
    this.input.complete();
  }

  // pipe: same input, transformed view
  pipe(): Stream<I, O>;
  pipe<A>(op1: OperatorFunction<O, A>): Stream<I, A>;
  pipe<A, B>(
    op1: OperatorFunction<O, A>,
    op2: OperatorFunction<A, B>
  ): Stream<I, B>;
  pipe<A, B, C>(
    op1: OperatorFunction<O, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>
  ): Stream<I, C>;
  pipe<A, B, C, D>(
    op1: OperatorFunction<O, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>
  ): Stream<I, D>;
  pipe(...ops: OperatorFunction<any, any>[]): Stream<any, any> {
    if (ops.length === 0) return this;
    const out$ = this.output$.pipe(...ops);
    return Stream.fromInternal(this.input, out$);
  }

  // tee: new input, merged downstream
  tee(): Stream<O, O>;
  tee<A>(op1: OperatorFunction<O, A>): Stream<O, A>;
  tee<A, B>(
    op1: OperatorFunction<O, A>,
    op2: OperatorFunction<A, B>
  ): Stream<O, B>;
  tee<A, B, C>(
    op1: OperatorFunction<O, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>
  ): Stream<O, C>;
  tee<A, B, C, D>(
    op1: OperatorFunction<O, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>
  ): Stream<O, D>;
  tee(...ops: OperatorFunction<any, any>[]): Stream<any, any> {
    const input = new Subject<any>();
    const fromUpstream$ =
      ops.length === 0 ? this.output$ : this.output$.pipe(...ops);
    const fromHere$ =
      ops.length === 0 ? input : input.pipe(...ops);
    const out$ = merge(fromUpstream$, fromHere$);
    return Stream.fromInternal(input, out$);
  }
}

export * from "rxjs";

export { ajax } from "rxjs/ajax";
export type { AjaxResponse, AjaxConfig } from "rxjs/ajax";

export { webSocket } from "rxjs/webSocket";

export { log }  from "./operators/log";
export { debug, step } from "./operators/debug";
export { switchTo }  from "./operators/switchTo";

export type {
  WebSocketSubject,
  WebSocketSubjectConfig
} from "rxjs/webSocket";
