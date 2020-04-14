(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@aurelia/kernel", "@aurelia/runtime", "../router"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const kernel_1 = require("@aurelia/kernel");
    const runtime_1 = require("@aurelia/runtime");
    const router_1 = require("../router");
    exports.ParentViewport = runtime_1.CustomElement.createInjectable();
    let ViewportCustomElement = class ViewportCustomElement {
        constructor(router, element, container, parentViewport) {
            this.router = router;
            this.container = container;
            this.parentViewport = parentViewport;
            this.name = 'default';
            this.usedBy = '';
            this.default = '';
            this.fallback = '';
            this.noScope = false;
            this.noLink = false;
            this.noHistory = false;
            this.stateful = false;
            this.viewport = null;
            this.isBound = false;
            this.element = element;
        }
        afterCompile(controller) {
            this.container = controller.context.get(kernel_1.IContainer);
            // console.log('Viewport creating', this.getAttribute('name', this.name), this.container, this.parentViewport, controller, this);
            // this.connect();
        }
        afterUnbind() {
            this.isBound = false;
        }
        connect() {
            if (this.router.rootScope === null) {
                return;
            }
            const name = this.getAttribute('name', this.name);
            let value = this.getAttribute('no-scope', this.noScope);
            const options = { scope: value === void 0 || !value ? true : false };
            value = this.getAttribute('used-by', this.usedBy);
            if (value !== void 0) {
                options.usedBy = value;
            }
            value = this.getAttribute('default', this.default);
            if (value !== void 0) {
                options.default = value;
            }
            value = this.getAttribute('fallback', this.fallback);
            if (value !== void 0) {
                options.fallback = value;
            }
            value = this.getAttribute('no-link', this.noLink, true);
            if (value !== void 0) {
                options.noLink = value;
            }
            value = this.getAttribute('no-history', this.noHistory, true);
            if (value !== void 0) {
                options.noHistory = value;
            }
            value = this.getAttribute('stateful', this.stateful, true);
            if (value !== void 0) {
                options.stateful = value;
            }
            this.viewport = this.router.connectViewport(this.viewport, this.container, name, this.element, options);
        }
        disconnect() {
            if (this.viewport) {
                this.router.disconnectViewport(this.viewport, this.container, this.element);
            }
            this.viewport = null;
        }
        beforeBind(flags) {
            this.isBound = true;
            this.connect();
            if (this.viewport) {
                this.viewport.beforeBind(flags);
            }
        }
        beforeAttach(flags) {
            if (this.viewport) {
                return this.viewport.beforeAttach(flags);
            }
            return Promise.resolve();
        }
        beforeDetach(flags) {
            if (this.viewport) {
                return this.viewport.beforeDetach(flags);
            }
            return Promise.resolve();
        }
        async beforeUnbind(flags) {
            if (this.viewport) {
                await this.viewport.beforeUnbind(flags);
                this.disconnect();
            }
        }
        getAttribute(key, value, checkExists = false) {
            const result = {};
            if (this.isBound && !checkExists) {
                return value;
            }
            else {
                if (this.element.hasAttribute(key)) {
                    if (checkExists) {
                        return true;
                    }
                    else {
                        value = this.element.getAttribute(key);
                        if (value.length > 0) {
                            return value;
                        }
                    }
                }
            }
            return void 0;
        }
    };
    tslib_1.__decorate([
        runtime_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], ViewportCustomElement.prototype, "name", void 0);
    tslib_1.__decorate([
        runtime_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], ViewportCustomElement.prototype, "usedBy", void 0);
    tslib_1.__decorate([
        runtime_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], ViewportCustomElement.prototype, "default", void 0);
    tslib_1.__decorate([
        runtime_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], ViewportCustomElement.prototype, "fallback", void 0);
    tslib_1.__decorate([
        runtime_1.bindable,
        tslib_1.__metadata("design:type", Boolean)
    ], ViewportCustomElement.prototype, "noScope", void 0);
    tslib_1.__decorate([
        runtime_1.bindable,
        tslib_1.__metadata("design:type", Boolean)
    ], ViewportCustomElement.prototype, "noLink", void 0);
    tslib_1.__decorate([
        runtime_1.bindable,
        tslib_1.__metadata("design:type", Boolean)
    ], ViewportCustomElement.prototype, "noHistory", void 0);
    tslib_1.__decorate([
        runtime_1.bindable,
        tslib_1.__metadata("design:type", Boolean)
    ], ViewportCustomElement.prototype, "stateful", void 0);
    ViewportCustomElement = tslib_1.__decorate([
        runtime_1.customElement({
            name: 'au-viewport',
            injectable: exports.ParentViewport
        }),
        tslib_1.__param(0, router_1.IRouter),
        tslib_1.__param(1, runtime_1.INode),
        tslib_1.__param(2, kernel_1.IContainer),
        tslib_1.__param(3, exports.ParentViewport),
        tslib_1.__metadata("design:paramtypes", [Object, Object, Object, ViewportCustomElement])
    ], ViewportCustomElement);
    exports.ViewportCustomElement = ViewportCustomElement;
});
//# sourceMappingURL=viewport.js.map