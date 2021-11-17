/*
 input: Raw array of space separated strings.
 format: An Object, the argument format from the command files.

 If a format is specified, returns an Object containing an array `main` and a Map `add` mapping from argument names
 to their values as an array. All arguments except the first one, up to the first add argument, are taken as main arguments.
 If any of the arguments are invalid, return null.

 If not, main is set to input.
 */
parseArgs = (input, format) => {
    const args = {main: [], add: new Map()};

    if (!format) {
        args.main = [...input];
        return args;
    }

    // whether an add arg has been encountered
    let addArgsStarted = false;

    for (let i = 0; i < input.length; i++) {
        if (!input[i].startsWith("-")) {
            if (addArgsStarted) {
                return null;
            }
            args.main.push(input[i]);
        } else {
            addArgsStarted = true;

            const arg = format[input[i].slice(1)];

            if (arg === undefined || args.add.has(arg)) {
                return null;
            }

            const argCount = arg.count;
            if (i + argCount >= input.length) {
                return null;
            }
            args.add.set(input[i], input.slice(i + 1, i + argCount));
            i += argCount;
        }
    }

    return args;
};

module.exports = parseArgs;