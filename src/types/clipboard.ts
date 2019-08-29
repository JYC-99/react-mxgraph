// for TS2339: Property 'clipboard' does not exist on type 'Navigator'.
// tslint:disable-next-line: no-empty-interface
export interface IClipboard extends EventTarget{
  writeText(newClipText: string): Promise<void>;
  readText(): Promise<string>;
  // Add any other methods you need here.
}

interface INavigatorClipboard extends Navigator{
  // Only available in a secure context.
  readonly clipboard: IClipboard;
}

// tslint:disable-next-line: no-empty-interface
export interface INavigator extends INavigatorClipboard { }

export interface IClipboardEvent extends ClipboardEvent {
  dataTransfer: {
    types: string;
    getData(str: string): void;
  };
}

// TS2339: Property 'mxGraphModel' does not exist on type 'Window'.
  // tslint:disable: no-any
export interface IWindow extends Window {
  mxGeometry: any;
  mxGraphModel: any;
  mxPoint: any;
}
