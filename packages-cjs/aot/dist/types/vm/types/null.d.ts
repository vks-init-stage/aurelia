import { $AnyNonError, PotentialNonEmptyCompletionType, CompletionTarget, $Any } from './_shared.js';
import { Realm, ExecutionContext } from '../realm.js';
import { $String } from './string.js';
import { $Number } from './number.js';
import { $Boolean } from './boolean.js';
import { $Error } from './error.js';
import { $ExportDeclaration, $ExportSpecifier, $ESModule } from '../ast/modules.js';
import { $ClassDeclaration } from '../ast/classes.js';
import { $FunctionDeclaration } from '../ast/functions.js';
import { $VariableStatement } from '../ast/statements.js';
import { $NullLiteral } from '../ast/literals.js';
import { I$Node } from '../ast/_shared.js';
export declare class $Null {
    readonly realm: Realm;
    readonly sourceNode: $ExportDeclaration | $ExportSpecifier | $ClassDeclaration | $FunctionDeclaration | $VariableStatement | $ESModule | $NullLiteral | null;
    readonly '<$Null>': unknown;
    readonly id: number;
    readonly IntrinsicName: 'null';
    '[[Type]]': PotentialNonEmptyCompletionType;
    readonly '[[Value]]': null;
    '[[Target]]': CompletionTarget;
    get isAbrupt(): false;
    get Type(): 'Null';
    get isEmpty(): false;
    get isUndefined(): false;
    get isNull(): true;
    get isNil(): true;
    get isBoolean(): false;
    get isNumber(): false;
    get isString(): false;
    get isSymbol(): false;
    get isPrimitive(): true;
    get isObject(): false;
    get isArray(): false;
    get isProxy(): false;
    get isFunction(): false;
    get isBoundFunction(): false;
    get isTruthy(): false;
    get isFalsey(): true;
    get isSpeculative(): false;
    get hasValue(): true;
    get isAmbiguous(): false;
    get isList(): false;
    readonly nodeStack: I$Node[];
    ctx: ExecutionContext | null;
    stack: string;
    constructor(realm: Realm, type?: PotentialNonEmptyCompletionType, target?: CompletionTarget, sourceNode?: $ExportDeclaration | $ExportSpecifier | $ClassDeclaration | $FunctionDeclaration | $VariableStatement | $ESModule | $NullLiteral | null);
    is(other: $AnyNonError): other is $Null;
    enrichWith(ctx: ExecutionContext, node: I$Node): this;
    [Symbol.toPrimitive](): string;
    [Symbol.toStringTag](): string;
    ToCompletion(type: PotentialNonEmptyCompletionType, target: CompletionTarget): this;
    UpdateEmpty(value: $Any): this;
    ToObject(ctx: ExecutionContext): $Error;
    ToPropertyKey(ctx: ExecutionContext): $String;
    ToLength(ctx: ExecutionContext): $Number;
    ToPrimitive(ctx: ExecutionContext): this;
    ToBoolean(ctx: ExecutionContext): $Boolean;
    ToNumber(ctx: ExecutionContext): $Number;
    ToInt32(ctx: ExecutionContext): $Number;
    ToUint32(ctx: ExecutionContext): $Number;
    ToInt16(ctx: ExecutionContext): $Number;
    ToUint16(ctx: ExecutionContext): $Number;
    ToInt8(ctx: ExecutionContext): $Number;
    ToUint8(ctx: ExecutionContext): $Number;
    ToUint8Clamp(ctx: ExecutionContext): $Number;
    ToString(ctx: ExecutionContext): $String;
    GetValue(ctx: ExecutionContext): this;
}
//# sourceMappingURL=null.d.ts.map