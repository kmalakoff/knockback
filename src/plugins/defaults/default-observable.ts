import ko from 'knockout';
import _ from 'underscore';
import { KB_DISPOSE_STATE } from '../../constants.ts';
import { publishMethods } from '../../kb.ts';
import { attachDispose, disposeMetadata, getObservable, setObservable } from '../../utils.ts';

const KEYS_PUBLISH = ['dispose', 'setToDefault'] as const;

// =============================================================================
// Interface
// =============================================================================

interface ReadableKnockoutValue<Read> extends ko.Subscribable<Read> {
  (): Read;
}

interface WritableKnockoutValue<Read, Write> extends ReadableKnockoutValue<Read> {
  (value: Write): unknown;
}

type UnwrappedObservable<Value> = Value extends DefaultObservable<infer Read, infer _Write> ? Read : Value extends ko.Observable<infer Read> ? Read : Value extends ko.Computed<infer Read> ? Read : Value;
/** Read type after applying the target and one-level default unwrapping rules. */
export type DefaultObservableRead<TargetRead, Default> = Exclude<UnwrappedObservable<TargetRead>, null | undefined> | UnwrappedObservable<Default>;
/** Default-observable result with separate public read and raw target write types. */
export type DefaultObservableResult<TargetRead, TargetWrite, Default> = DefaultObservableValue<DefaultObservableRead<TargetRead, Default>, TargetWrite>;

type SplitComputedFactory = <Read, Write>(options: { read: () => Read; write: (value: Write) => void }) => DefaultObservable<Read, Write>;

export interface DefaultObservable<Read, Write = Read> extends ko.ComputedFunctions<Read> {
  (): Read;
  (value: Write): this;
  destroy(): void;
  dispose(): void;
  release(): void;
  setToDefault(): void;
}

/** Public result type used by package entrypoint declarations. */
export type DefaultObservableValue<Read, Write = Read> = DefaultObservable<Read, Write>;

export interface DefaultObservableInstance {
  [key: string]: unknown;
  __kb: { observable?: ko.Observable };
  __kb_dispose?: number;
  dv: unknown;
  dispose(): void;
  setToDefault(): void;
}

type DefaultObservableState<Default> = DefaultObservableInstance & { dv: Default };

// =============================================================================
// Factory Function (Primary API)
// =============================================================================

/**
 * Creates a computed that provides a default value when the target is null or undefined.
 *
 * @param targetObservable - The observable or default computed to read and write
 * @param defaultValue - The raw value, observable, or computed to write when resetting
 * @returns A computed that reads the target or its unwrapped default value
 *
 * @example
 *   const wrapped_name = kb.defaultObservable(kb.observable(model, 'name'), '(no name)');
 */
export function defaultObservable<Stored, Default extends Stored = Stored>(targetObservable: ko.Observable<Stored>, defaultValue: Default): DefaultObservableResult<Stored, Stored, Default>;
export function defaultObservable<TargetRead, TargetWrite, Default extends TargetWrite = TargetWrite>(targetObservable: DefaultObservable<TargetRead, TargetWrite>, defaultValue: Default): DefaultObservableResult<TargetRead, TargetWrite, Default>;
export function defaultObservable<TargetRead, TargetWrite, Default extends TargetWrite>(targetObservable: WritableKnockoutValue<TargetRead, TargetWrite>, defaultValue: Default): DefaultObservableResult<TargetRead, TargetWrite, Default> {
  type Read = DefaultObservableRead<TargetRead, Default>;
  // Instance state (closure-based)
  const state: DefaultObservableState<Default> = {
    __kb: {},
    dv: defaultValue,
    dispose,
    setToDefault,
  };

  const observable = setObservable(
    state,
    (ko.computed as unknown as SplitComputedFactory)<Read, TargetWrite>({
      read: (): Read => {
        const currentTarget = (ko.utils.unwrapObservable as <Value>(value: Value) => UnwrappedObservable<Value>)(targetObservable());
        if (_.isNull(currentTarget) || _.isUndefined(currentTarget)) {
          return (ko.utils.unwrapObservable as <Value>(value: Value) => UnwrappedObservable<Value>)(state.dv) as Read;
        }
        return currentTarget as Read;
      },
      write: (value: TargetWrite) => {
        targetObservable(value);
      },
    })
  ) as DefaultObservable<Read, TargetWrite>;
  const disposeComputed = observable.dispose.bind(observable);

  // Publish public interface on the observable
  publishMethods(observable, state, KEYS_PUBLISH);
  attachDispose(observable, dispose);

  return observable;

  // =============================================================================
  // Instance Methods (closures)
  // =============================================================================

  function dispose(): void {
    if (state.__kb_dispose && state.__kb_dispose >= KB_DISPOSE_STATE.DISPOSING) return;
    state.__kb_dispose = KB_DISPOSE_STATE.DISPOSED;
    disposeComputed();
    disposeMetadata(state);
  }

  function setToDefault(): void {
    const obs = getObservable(state) as DefaultObservable<Read, TargetWrite> | undefined;
    if (obs) {
      obs(state.dv);
    }
  }
}

export default defaultObservable;
