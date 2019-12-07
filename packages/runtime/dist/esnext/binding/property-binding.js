import { __decorate, __metadata } from "tslib";
import { IServiceLocator, Reporter, } from '@aurelia/kernel';
import { BindingMode, } from '../flags';
import { ILifecycle } from '../lifecycle';
import { IObserverLocator } from '../observation/observer-locator';
import { hasBind, hasUnbind, } from './ast';
import { connectable, } from './connectable';
// BindingMode is not a const enum (and therefore not inlined), so assigning them to a variable to save a member accessor is a minor perf tweak
const { oneTime, toView, fromView } = BindingMode;
// pre-combining flags for bitwise checks is a minor perf tweak
const toViewOrOneTime = toView | oneTime;
let PropertyBinding = class PropertyBinding {
    constructor(sourceExpression, target, targetProperty, mode, observerLocator, locator) {
        this.sourceExpression = sourceExpression;
        this.target = target;
        this.targetProperty = targetProperty;
        this.mode = mode;
        this.observerLocator = observerLocator;
        this.locator = locator;
        this.interceptor = this;
        this.$state = 0 /* none */;
        this.$scope = void 0;
        this.targetObserver = void 0;
        this.persistentFlags = 0 /* none */;
        connectable.assignIdTo(this);
        this.$lifecycle = locator.get(ILifecycle);
    }
    ;
    updateTarget(value, flags) {
        flags |= this.persistentFlags;
        this.targetObserver.setValue(value, flags);
    }
    updateSource(value, flags) {
        flags |= this.persistentFlags;
        this.sourceExpression.assign(flags, this.$scope, this.locator, value, this.part);
    }
    handleChange(newValue, _previousValue, flags) {
        if ((this.$state & 4 /* isBound */) === 0) {
            return;
        }
        flags |= this.persistentFlags;
        if ((flags & 16 /* updateTargetInstance */) > 0) {
            const previousValue = this.targetObserver.getValue();
            // if the only observable is an AccessScope then we can assume the passed-in newValue is the correct and latest value
            if (this.sourceExpression.$kind !== 10082 /* AccessScope */ || this.observerSlots > 1) {
                newValue = this.sourceExpression.evaluate(flags, this.$scope, this.locator, this.part);
            }
            if (newValue !== previousValue) {
                this.interceptor.updateTarget(newValue, flags);
            }
            if ((this.mode & oneTime) === 0) {
                this.version++;
                this.sourceExpression.connect(flags, this.$scope, this.interceptor, this.part);
                this.interceptor.unobserve(false);
            }
            return;
        }
        if ((flags & 32 /* updateSourceExpression */) > 0) {
            if (newValue !== this.sourceExpression.evaluate(flags, this.$scope, this.locator, this.part)) {
                this.interceptor.updateSource(newValue, flags);
            }
            return;
        }
        throw Reporter.error(15, flags);
    }
    $bind(flags, scope, part) {
        if (this.$state & 4 /* isBound */) {
            if (this.$scope === scope) {
                return;
            }
            this.interceptor.$unbind(flags | 4096 /* fromBind */);
        }
        // add isBinding flag
        this.$state |= 1 /* isBinding */;
        // Force property binding to always be strict
        flags |= 4 /* isStrictBindingStrategy */;
        // Store flags which we can only receive during $bind and need to pass on
        // to the AST during evaluate/connect/assign
        this.persistentFlags = flags & 2080374799 /* persistentBindingFlags */;
        this.$scope = scope;
        this.part = part;
        let sourceExpression = this.sourceExpression;
        if (hasBind(sourceExpression)) {
            sourceExpression.bind(flags, scope, this.interceptor);
        }
        let targetObserver = this.targetObserver;
        if (!targetObserver) {
            if (this.mode & fromView) {
                targetObserver = this.targetObserver = this.observerLocator.getObserver(flags, this.target, this.targetProperty);
            }
            else {
                targetObserver = this.targetObserver = this.observerLocator.getAccessor(flags, this.target, this.targetProperty);
            }
        }
        if (this.mode !== BindingMode.oneTime && targetObserver.bind) {
            targetObserver.bind(flags);
        }
        // during bind, binding behavior might have changed sourceExpression
        sourceExpression = this.sourceExpression;
        if (this.mode & toViewOrOneTime) {
            this.interceptor.updateTarget(sourceExpression.evaluate(flags, scope, this.locator, part), flags);
        }
        if (this.mode & toView) {
            sourceExpression.connect(flags, scope, this.interceptor, part);
        }
        if (this.mode & fromView) {
            targetObserver.subscribe(this.interceptor);
            targetObserver[this.id] |= 32 /* updateSourceExpression */;
        }
        // add isBound flag and remove isBinding flag
        this.$state |= 4 /* isBound */;
        this.$state &= ~1 /* isBinding */;
    }
    $unbind(flags) {
        if (!(this.$state & 4 /* isBound */)) {
            return;
        }
        // add isUnbinding flag
        this.$state |= 2 /* isUnbinding */;
        // clear persistent flags
        this.persistentFlags = 0 /* none */;
        if (hasUnbind(this.sourceExpression)) {
            this.sourceExpression.unbind(flags, this.$scope, this.interceptor);
        }
        this.$scope = void 0;
        if (this.targetObserver.unbind) {
            this.targetObserver.unbind(flags);
        }
        if (this.targetObserver.unsubscribe) {
            this.targetObserver.unsubscribe(this.interceptor);
            this.targetObserver[this.id] &= ~32 /* updateSourceExpression */;
        }
        this.interceptor.unobserve(true);
        // remove isBound and isUnbinding flags
        this.$state &= ~(4 /* isBound */ | 2 /* isUnbinding */);
    }
};
PropertyBinding = __decorate([
    connectable(),
    __metadata("design:paramtypes", [Object, Object, String, Number, Object, Object])
], PropertyBinding);
export { PropertyBinding };
//# sourceMappingURL=property-binding.js.map