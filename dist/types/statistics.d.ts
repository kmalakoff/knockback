declare const _exports: {
    new (): {
        model_events_tracker: any[];
        registered_tracker: {};
        clear(): any[];
        addModelEvent(event: any): number;
        modelEventsStatsString(): string;
        register(key: any, obj: any): any;
        unregister(key: any, obj: any): any;
        registeredCount(type: any): any;
        registeredStatsString(success_message: any): any;
        registeredTracker(key: any): any;
    };
    eventsStats(obj: any, key: any): {
        count: number;
    };
};
export = _exports;
