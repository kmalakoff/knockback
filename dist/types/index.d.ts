declare const _exports: {
    new (): {};
    initClass(): void;
    wasReleased(obj: any): any;
    isReleaseable(obj: any, depth: any): boolean;
    release(obj: any): any;
    releaseKeys(obj: any): void;
    releaseOnNodeRemove(view_model: any, node: any): void;
    renderTemplate(template: any, view_model: any, options: any): any;
    applyBindings(view_model: any, node: any): any;
    getValue(model: any, key: any, args: any): any;
    setValue(model: any, key: any, value: any): any;
    _throwMissing(instance: any, message: any): void;
    _throwUnexpected(instance: any, message: any): void;
    publishMethods(observable: any, instance: any, methods: any): void;
    peek(obs: any): any;
    isModel(obj: any): boolean;
    isCollection(obj: any): boolean;
};
export = _exports;
