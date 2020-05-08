var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@aurelia/kernel", "../../dom", "../../lifecycle", "../custom-attribute"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const kernel_1 = require("@aurelia/kernel");
    const dom_1 = require("../../dom");
    const lifecycle_1 = require("../../lifecycle");
    const custom_attribute_1 = require("../custom-attribute");
    let Replaceable = class Replaceable {
        constructor(factory, location) {
            this.factory = factory;
            this.location = location;
            this.id = kernel_1.nextId('au$component');
            this.view = this.factory.create();
            this.view.hold(location, 1 /* insertBefore */);
        }
        beforeBind(flags) {
            this.view.parent = this.$controller;
            return this.view.bind(flags | 67108864 /* allowParentScopeTraversal */, this.$controller.scope, this.factory.name);
        }
        beforeAttach(flags) {
            this.view.attach(flags);
        }
        beforeDetach(flags) {
            this.view.detach(flags);
        }
        beforeUnbind(flags) {
            const task = this.view.unbind(flags);
            this.view.parent = void 0;
            return task;
        }
    };
    Replaceable = __decorate([
        custom_attribute_1.templateController('replaceable'),
        __param(0, lifecycle_1.IViewFactory),
        __param(1, dom_1.IRenderLocation),
        __metadata("design:paramtypes", [Object, Object])
    ], Replaceable);
    exports.Replaceable = Replaceable;
});
//# sourceMappingURL=replaceable.js.map