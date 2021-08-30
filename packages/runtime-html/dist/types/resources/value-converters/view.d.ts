import { ComposableObjectComponentType, IViewLocator, ViewSelector } from '../../templating/view.js';
import type { ICustomElementViewModel } from '../../templating/controller.js';
export declare class ViewValueConverter {
    constructor(
    /** @internal */ _viewLocator: IViewLocator);
    toView<T extends ICustomElementViewModel>(object: T | null | undefined, viewNameOrSelector?: string | ViewSelector): ComposableObjectComponentType<T> | null;
}
//# sourceMappingURL=view.d.ts.map