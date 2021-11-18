import {Client, Collection, Message} from "discord.js";

export interface BotClient extends Client {
    commands: Collection<string, Command>
}

export interface Event {
    /**
     * The name of the event.
     */
    name: string,
    /**
     * Whether to run this event only once.
     */
    once?: boolean,
    /**
     * The main function to be executed.
     */
    execute(client: BotClient, args: any): void
}

export interface CommandArguments {
    /**
     * The main arguments.
     */
    main: string[],
    /**
     * Additional (optional) arguments; the arguments prefixed with '-'. Maps from the argument
     * name (without '-') to their values.
     */
    add: Map<string, string[]>
}

export interface Command {
    /**
     * The name of the command the user uses to call this command.
     */
    name: string,
    /**
     * A description of this command. Displayed in the `help` command.
     */
    description: string,
    /**
     * Alternative names for calling this command.
     */
    aliases?: string[],
    /**
     * A guide on how to use this command, usually the main arguments. Displayed in the `help` command
     * as `![command-name] [usage]` in the 'Usage' section.
     */
    usage?: string,
    /**
     * Any additional notes go here. Displayed in the `help` command.
     */
    notes?: string,
    /**
     * Additional arguments. This should be an Object {argName1: {count: ?, description: ?}...}.
     */
    args?: {[argName: string]: {count: number, description: string}},
    /**
     * If this is true, only the developer can call this command.
     */
    dev?: boolean
    /**
     * The main function this command does.
     * @param message the message that triggered this command
     * @param args the arguments parsed by argumentParser.ts
     * @param prefix the prefix of this bot in the message's server
     */
    execute: (message: Message, args: CommandArguments, prefix: string) => void,
}
