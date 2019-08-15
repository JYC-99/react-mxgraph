export interface ICustomCommand {
  name: string;
  config: ICommandConfig;
}

export interface ICommandConfig {
  shortcutCodes: string[];
  enable(): boolean;
  execute(): void;
}

export const customShortcutDictionary = {};
