// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getJSDocComment, parseComment } from "@es-joy/jsdoccomment";
import { type Token } from "@typescript-eslint/types/dist/generated/ast-spec.js";
import { type TSESTree } from "@typescript-eslint/utils";
import { type SourceCode } from "@typescript-eslint/utils/dist/ts-eslint";
import { type Block } from "comment-parser";

interface DocblockOptionsInterface {
    minLines: number;
    maxLines: number;
}

type getJSDocumentationCommentType = (
    sourceCode: Readonly<SourceCode>,
    node: TSESTree.BaseNode,
    options: DocblockOptionsInterface
) => Token | null;

type parseCommentType = (token: Token) => Block;

export interface DocblockReturnType {
    token: Token;
    parse: Block;
}

export default class DocblockHelper {

    public getDocblockNode(sourceCode: Readonly<SourceCode>, node: TSESTree.BaseNode): DocblockReturnType | null {
        const docblockBlock = (getJSDocComment as unknown as getJSDocumentationCommentType)(
            sourceCode,
            node,
            {
                minLines: 0,
                maxLines: 1,
            },
        );

        return docblockBlock && {
            token: docblockBlock,
            parse: (parseComment as unknown as parseCommentType)(docblockBlock),
        };
    }

}
