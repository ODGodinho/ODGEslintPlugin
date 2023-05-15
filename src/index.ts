import { rule } from "./rules/no-inconsistent-docblock";

// eslint-disable-next-line import/no-commonjs, unicorn/prefer-module
export const index = {
    root: true,
    rules: {
        "no-inconsistent-docblock": rule,
    },
};
