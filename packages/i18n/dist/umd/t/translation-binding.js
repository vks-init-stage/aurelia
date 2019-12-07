(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@aurelia/kernel", "@aurelia/runtime", "../i18n"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TranslationBinding_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const kernel_1 = require("@aurelia/kernel");
    const runtime_1 = require("@aurelia/runtime");
    const i18n_1 = require("../i18n");
    const contentAttributes = ['textContent', 'innerHTML', 'prepend', 'append'];
    const attributeAliases = new Map([['text', 'textContent'], ['html', 'innerHTML']]);
    let TranslationBinding = TranslationBinding_1 = class TranslationBinding {
        constructor(target, observerLocator, locator) {
            this.observerLocator = observerLocator;
            this.locator = locator;
            this.interceptor = this;
            this.contentAttributes = contentAttributes;
            this.target = target;
            this.$state = 0 /* none */;
            this.i18n = this.locator.get(i18n_1.I18N);
            const ea = this.locator.get(kernel_1.IEventAggregator);
            ea.subscribe("i18n:locale:changed" /* I18N_EA_CHANNEL */, this.handleLocaleChange.bind(this));
            this.targetObservers = new Set();
        }
        static create({ parser, observerLocator, context, renderable, target, instruction, isParameterContext }) {
            const binding = this.getBinding({ observerLocator, context, renderable, target });
            const expr = runtime_1.ensureExpression(parser, instruction.from, 53 /* BindCommand */);
            if (!isParameterContext) {
                const interpolation = expr instanceof runtime_1.CustomExpression ? parser.parse(expr.value, 2048 /* Interpolation */) : undefined;
                binding.expr = interpolation || expr;
            }
            else {
                binding.parametersExpr = expr;
            }
        }
        static getBinding({ observerLocator, context, renderable, target }) {
            let binding = renderable.bindings && renderable.bindings.find((b) => b instanceof TranslationBinding_1 && b.target === target);
            if (!binding) {
                binding = new TranslationBinding_1(target, observerLocator, context);
                runtime_1.addBinding(renderable, binding);
            }
            return binding;
        }
        $bind(flags, scope, part) {
            if (!this.expr) {
                throw new Error('key expression is missing');
            } // TODO replace with error code
            this.scope = scope;
            this.isInterpolatedSourceExpr = this.expr instanceof runtime_1.Interpolation;
            this.keyExpression = this.expr.evaluate(flags, scope, this.locator, part);
            if (this.parametersExpr) {
                const parametersFlags = flags | 1073741824 /* secondaryExpression */;
                this.translationParameters = this.parametersExpr.evaluate(parametersFlags, scope, this.locator, part);
                this.parametersExpr.connect(parametersFlags, scope, this, part);
            }
            const expressions = !(this.expr instanceof runtime_1.CustomExpression) ? this.isInterpolatedSourceExpr ? this.expr.expressions : [this.expr] : [];
            for (const expr of expressions) {
                expr.connect(flags, scope, this, part);
            }
            this.updateTranslations(flags);
            this.$state = 4 /* isBound */;
        }
        $unbind(flags) {
            if (!(this.$state & 4 /* isBound */)) {
                return;
            }
            this.$state |= 2 /* isUnbinding */;
            if (this.expr.unbind) {
                this.expr.unbind(flags, this.scope, this);
            }
            if (this.parametersExpr && this.parametersExpr.unbind) {
                this.parametersExpr.unbind(flags | 1073741824 /* secondaryExpression */, this.scope, this);
            }
            this.unobserveTargets(flags);
            this.scope = (void 0);
            this.unobserve(true);
        }
        handleChange(newValue, _previousValue, flags) {
            if (flags & 1073741824 /* secondaryExpression */) {
                // @ToDo, @Fixme: where do we get "part" from (last argument for evaluate)?
                this.translationParameters = this.parametersExpr.evaluate(flags, this.scope, this.locator);
            }
            else {
                this.keyExpression = this.isInterpolatedSourceExpr
                    ? this.expr.evaluate(flags, this.scope, this.locator, '')
                    : newValue;
            }
            this.updateTranslations(flags);
        }
        handleLocaleChange() {
            this.updateTranslations(0 /* none */);
        }
        updateTranslations(flags) {
            const results = this.i18n.evaluate(this.keyExpression, this.translationParameters);
            const content = Object.create(null);
            this.unobserveTargets(flags);
            for (const item of results) {
                const value = item.value;
                const attributes = this.preprocessAttributes(item.attributes);
                for (const attribute of attributes) {
                    if (this.isContentAttribute(attribute)) {
                        content[attribute] = value;
                    }
                    else {
                        this.updateAttribute(attribute, value, flags);
                    }
                }
            }
            if (Object.keys(content).length) {
                this.updateContent(content, flags);
            }
        }
        updateAttribute(attribute, value, flags) {
            const controller = runtime_1.CustomElement.for(this.target);
            const observer = controller && controller.viewModel
                ? this.observerLocator.getAccessor(0 /* none */, controller.viewModel, attribute)
                : this.observerLocator.getAccessor(0 /* none */, this.target, attribute);
            observer.setValue(value, flags);
            this.targetObservers.add(observer);
        }
        preprocessAttributes(attributes) {
            if (attributes.length === 0) {
                attributes = this.target.tagName === 'IMG' ? ['src'] : ['textContent'];
            }
            for (const [alias, attribute] of attributeAliases) {
                const aliasIndex = attributes.findIndex((attr) => attr === alias);
                if (aliasIndex > -1) {
                    attributes.splice(aliasIndex, 1, attribute);
                }
            }
            return attributes;
        }
        isContentAttribute(attribute) {
            return this.contentAttributes.includes(attribute);
        }
        updateContent(content, flags) {
            const children = kernel_1.toArray(this.target.childNodes);
            const fallBackContents = [];
            const marker = 'au-i18n';
            // extract the original content, not manipulated by au-i18n
            for (const child of children) {
                if (!Reflect.get(child, marker)) {
                    fallBackContents.push(child);
                }
            }
            const template = this.prepareTemplate(content, marker, fallBackContents);
            // difficult to use the set property approach in this case, as most of the properties of Node is readonly
            // const observer = this.observerLocator.getAccessor(LifecycleFlags.none, this.target, '??');
            // observer.setValue(??, flags);
            this.target.innerHTML = '';
            for (const child of kernel_1.toArray(template.content.childNodes)) {
                this.target.appendChild(child);
            }
        }
        prepareTemplate(content, marker, fallBackContents) {
            const template = runtime_1.DOM.createTemplate();
            this.addContentToTemplate(template, content.prepend, marker);
            // build content: prioritize [html], then textContent, and falls back to original content
            if (!this.addContentToTemplate(template, content.innerHTML || content.textContent, marker)) {
                for (const fallbackContent of fallBackContents) {
                    template.content.append(fallbackContent);
                }
            }
            this.addContentToTemplate(template, content.append, marker);
            return template;
        }
        addContentToTemplate(template, content, marker) {
            if (content) {
                const addendum = runtime_1.DOM.createDocumentFragment(content);
                for (const child of kernel_1.toArray(addendum.childNodes)) {
                    Reflect.set(child, marker, true);
                    template.content.append(child);
                }
                return true;
            }
            return false;
        }
        unobserveTargets(flags) {
            for (const observer of this.targetObservers) {
                if (observer.unbind) {
                    observer.unbind(flags);
                }
            }
            this.targetObservers.clear();
        }
    };
    TranslationBinding = TranslationBinding_1 = tslib_1.__decorate([
        runtime_1.connectable(),
        tslib_1.__metadata("design:paramtypes", [Object, Object, Object])
    ], TranslationBinding);
    exports.TranslationBinding = TranslationBinding;
});
//# sourceMappingURL=translation-binding.js.map