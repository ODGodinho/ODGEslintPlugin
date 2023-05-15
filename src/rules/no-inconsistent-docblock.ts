import {
    type FunctionExpression, type TSTypeAnnotation, type Parameter, type FunctionDeclaration,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { ESLintUtils } from "@typescript-eslint/utils";
import { type Spec } from "comment-parser";
import { type RuleContext } from "node_modules/@typescript-eslint/utils/dist/ts-eslint/index";

import DocblockHelper from "../helpers/DocblockHelper";

const { RuleCreator: ruleCreator } = ESLintUtils;
const createRule = ruleCreator(
    (name) => `https://example.com/rule/${name}`,
);

export function getReturnNotMatch(
    codeReturn: TSTypeAnnotation | undefined,
    docblockParameter: Spec[],
    content: string,
): boolean {
    if (!codeReturn) return false;

    const parameterTypeRange = codeReturn.typeAnnotation.range;
    const unionTokenReturn = content.slice(parameterTypeRange[0], parameterTypeRange[1]);

    if (!docblockParameter[0]) return false;

    return unionTokenReturn !== docblockParameter[0].type;
}

export function getParameterNotMatch(
    codeParameter: Parameter[],
    docblockParameter: Spec[],
    content: string,
): boolean {
    for (const [ index, parameter ] of codeParameter.entries()) {
        const parameterTypeRange = "typeAnnotation" in parameter
            && parameter.typeAnnotation?.typeAnnotation.range;

        if (!parameterTypeRange) continue;

        const unionTokenParameter = content.slice(parameterTypeRange[0], parameterTypeRange[1]);
        if (!docblockParameter[index]) return false;

        const isValidOptional = "optional" in parameter && parameter.optional
            ? `undefined | ${unionTokenParameter}` !== docblockParameter[index].type
                && `${unionTokenParameter} | undefined` !== docblockParameter[index].type
            : unionTokenParameter !== docblockParameter[index].type;

        if (isValidOptional) {
            return true;
        }
    }

    return false;
}

export function methodRule(
    node: FunctionDeclaration | FunctionExpression,
    context: RuleContext<string, unknown[]>,
    docblockHelper: DocblockHelper,
): void {
    const sourceCode = context.getSourceCode();
    const docblock = docblockHelper.getDocblockNode(sourceCode, node);
    if (!docblock) return;

    const docblockParameter = docblock.parse.tags.filter((tag) => tag.tag === "param");
    const docblockReturn = docblock.parse.tags.filter((tag) => tag.tag === "returns");
    const codeParameter = node.params;

    if (getParameterNotMatch(codeParameter, docblockParameter, sourceCode.getText())) {
        context.report({
            node,
            messageId: "invalidParamType",
        });
    }

    if (getReturnNotMatch(node.returnType, docblockReturn, sourceCode.getText())) {
        context.report({
            node,
            messageId: "invalidReturnType",
        });
    }
}

export const rule = createRule({
    name: "no-inconsistent-docblock",
    meta: {
        docs: {
            description: "Function declaration names should start with an upper-case letter.",
            recommended: "warn",
        },
        messages: {
            invalidParamType: "@Param not match with function type",
            invalidReturnType: "@Returns not match with function type",
        },
        type: "suggestion",
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const docblockHelper = new DocblockHelper();

        return {
            "FunctionDeclaration": (node): void => {
                methodRule(node, context, docblockHelper);
            },
            "FunctionExpression": (node): void => {
                methodRule(node, context, docblockHelper);
            },
        };
    },
});
