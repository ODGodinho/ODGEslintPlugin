import { readFileSync } from "node:fs";

import { type TSTypeAnnotation, type Parameter } from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES } from "@typescript-eslint/types/dist/generated/ast-spec";
import { ESLintUtils } from "@typescript-eslint/utils";
import { type Spec } from "comment-parser";

import { getParameterNotMatch, getReturnNotMatch, rule } from "~/rules/no-inconsistent-docblock";

const ruleTester = new ESLintUtils.RuleTester({
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2022,
        sourceType: "module",
        project: [ "./tsconfig.json" ], // Specify it only for TypeScript files
        createDefaultProgram: true,
    },
});

const currentFolder = `${process.cwd()}/tests/jest/no-inconsistent-docblock/cases`;

describe("no-inconsistent-docblock", () => {
    ruleTester.run("no-inconsistent-docblock-return", rule, {
        valid: [
            {
                code: readFileSync(`${currentFolder}/valid1.ts`).toString(),
            },
            {
                code: readFileSync(`${currentFolder}/valid2.ts`).toString(),
            },
            {
                code: readFileSync(`${currentFolder}/valid3.ts`).toString(),
            },
            {
                code: readFileSync(`${currentFolder}/valid4.ts`).toString(),
            },
            {
                code: readFileSync(`${currentFolder}/valid5.ts`).toString(),
            },
            {
                code: readFileSync(`${currentFolder}/valid6.ts`).toString(),
            },
            {
                code: readFileSync(`${currentFolder}/valid7.ts`).toString(),
            },
            {
                code: readFileSync(`${currentFolder}/valid8.ts`).toString(),
            },
            {
                code: readFileSync(`${currentFolder}/valid9.ts`).toString(),
            },
            {
                code: readFileSync(`${currentFolder}/valid10.ts`).toString(),
            },
            {
                code: readFileSync(`${currentFolder}/valid11.ts`).toString(),
            },
            {
                code: readFileSync(`${currentFolder}/valid12.ts`).toString(),
            },
        ],
        invalid: [
            {
                code: readFileSync(`${currentFolder}/invalid1.ts`).toString(),
                errors: [ {
                    messageId: "invalidParamType",
                } ],
            },
            {
                code: readFileSync(`${currentFolder}/invalid2.ts`).toString(),
                errors: [ {
                    messageId: "invalidParamType",
                } ],
            },
            {
                code: readFileSync(`${currentFolder}/invalid3.ts`).toString(),
                errors: [ {
                    messageId: "invalidReturnType",
                } ],
            },
            {
                code: readFileSync(`${currentFolder}/invalid4.ts`).toString(),
                errors: [ {
                    messageId: "invalidReturnType",
                } ],
            },
            {
                code: readFileSync(`${currentFolder}/invalid5.ts`).toString(),
                errors: [ {
                    messageId: "invalidParamType",
                } ],
            },
            {
                code: readFileSync(`${currentFolder}/invalid6.ts`).toString(),
                errors: [ {
                    messageId: "invalidParamType",
                } ],
            },
        ],
    });

    test("getParameterNotMatch", () => {
        const parameter = {
            type: AST_NODE_TYPES.AssignmentPattern,
            typeAnnotation: {
                type: AST_NODE_TYPES.TSTypeAnnotation,
                range: [ 0, 0 ],
                typeAnnotation: {
                    type: AST_NODE_TYPES.TSFunctionType,
                    range: [ 0, 0 ],
                    params: [],
                    loc: {
                        start: { line: 0, column: 0 },
                        end: { line: 0, column: 0 },
                    },
                },
            },
        };

        expect(getParameterNotMatch(
            [ parameter as unknown as Parameter ],
            [ { type: "" } as unknown as Spec ],
            "",
        )).toBeFalsy();

        expect(getReturnNotMatch(
            parameter as unknown as TSTypeAnnotation,
            [ { type: "" } as unknown as Spec ],
            "",
        )).toBeFalsy();
    });

    test("Test Not TypeNotation", () => {
        const parameter = {
            type: AST_NODE_TYPES.AssignmentPattern,
            typeAnnotation: undefined,
        };

        expect(getParameterNotMatch(
            [ parameter as unknown as Parameter ],
            [ { type: "" } as unknown as Spec ],
            "",
        )).toBeFalsy();
    });
});
