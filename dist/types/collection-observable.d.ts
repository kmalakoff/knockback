export default class CollectionObservable {
    static extend: any;
    constructor(collection: any, _view_model: any, options: any, ...args: any[]);
    _onCollectionChange(event: any, arg: any): any;
    in_edit: number;
    __kb: {};
    auto_compact: boolean;
    _comparator: any;
    _filters: any;
    create_options: {
        store: any;
    };
    path: any;
    models_only: any;
    _collection: any;
    collection: any;
    _mapper: any;
    destroy(): any;
    __kb_released: boolean;
    shareOptions(): {
        store: any;
        factory: any;
    };
    filters(filters: any): any;
    comparator(comparator: any): any;
    sortAttribute(sort_attribute: any): any;
    viewModelByModel(model: any): any;
    hasViewModels(): boolean;
    compact(): any;
    _shareOrCreateFactory(options: any): any;
    _onModelRemove(model: any): number;
    _onObservableArrayChange(models_or_view_models: any): any;
    _attributeComparator(sort_attribute: any): (model_a: any, model_b: any) => any;
    _createViewModel(model: any): any;
    _selectModel(model: any): boolean;
}
