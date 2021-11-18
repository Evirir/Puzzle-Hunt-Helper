import {CommandArguments} from "../types";

/**
 * @param input Raw array of space separated strings.
 * @param format An Object, the argument format from the command files.
 *
 * @return If a format is specified, returns an Object containing an array `main` and a Map `add` mapping from argument names
 * to their values as an array. All arguments except the first one, up to the first add argument, are taken as main arguments.
 * If any of the arguments are invalid, return null.
 *
 * If not, main is set to input.
 */
const parseArgs = (input: string[], format?: any): CommandArguments | null => {
    const args: any = {main: [], add: new Map()};

    if (!format) {
        args.main = [...input];
        return args;
    }

    // whether an add arg has been encountered
    let addArgsStarted: boolean = false;

    for (let i = 0; i < input.length; i++) {
        if (!input[i].startsWith("-")) {
            if (addArgsStarted) {
                return null;
            }
            args.main.push(input[i]);
        } else {
            addArgsStarted = true;

            const argName = input[i].slice(1);

            if (!format.hasOwnProperty(argName) || args.add.has(argName)) {
                return null;
            }

            const argCount = format[argName].count;
            if (i + argCount >= input.length) {
                return null;
            }
            args.add.set(argName, input.slice(i + 1, i + argCount + 1));
            i += argCount;
        }
    }

    return args;
};

export default parseArgs;