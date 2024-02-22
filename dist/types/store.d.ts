declare const _exports: {
    new (): {
        observable_records: {};
        replaced_observables: any[];
        destroy(): any;
        __kb_released: boolean;
        clear(): void;
        compact(): void;
        retain(observable: any, obj: any, creator: any): any;
        retainOrCreate(obj: any, options: any, deep_retain: any): any;
        reuse(observable: any, obj: any): void;
        release(observable: any, force: any): any;
        find(obj: any, creator: any): any;
        _refCount(observable: any): any;
        _canRegister(observable: any): boolean;
        _cid(obj: any): any;
        _creatorId(creator: any): any;
        _storeReferences(observable: any): any;
        _getOrCreateStoreReferences(observable: any): any;
        _clearStoreReferences(observable: any): void;
        _retire(observable: any): any;
        _add(observable: any, obj: any, creator: any): any;
        _remove(observable: any): any;
        _creator(obj: any, options: any): any;
    };
    initClass(): void;
    useOptionsOrCreate(options: any, obj: any, observable: any): any;
};
export = _exports;
