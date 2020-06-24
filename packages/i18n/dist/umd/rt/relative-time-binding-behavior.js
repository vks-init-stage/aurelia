var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@aurelia/runtime", "../utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const runtime_1 = require("@aurelia/runtime");
    const utils_1 = require("../utils");
    let RelativeTimeBindingBehavior = class RelativeTimeBindingBehavior {
        bind(flags, scope, binding) {
            utils_1.createIntlFormatValueConverterExpression("rt" /* relativeTimeValueConverterName */, binding);
        }
    };
    RelativeTimeBindingBehavior = __decorate([
        runtime_1.bindingBehavior("rt" /* relativeTimeValueConverterName */)
    ], RelativeTimeBindingBehavior);
    exports.RelativeTimeBindingBehavior = RelativeTimeBindingBehavior;
});
//# sourceMappingURL=relative-time-binding-behavior.js.map