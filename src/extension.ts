import * as vscode from 'vscode';
import { ConfigProvider } from './ConfigProvider';
import { MapBrowser } from './MapBrowser';
import { ExtConfig } from './model/ExtConfig';
import { Resolver } from './Resolver';

export const LANGUAGE_ID = "dks";

export function activate(context: vscode.ExtensionContext) {
	ConfigProvider.setConfig(vscode.workspace.getConfiguration() as unknown as ExtConfig);
	new Resolver().subscribe(context);
	new MapBrowser().registerCommand();
}

export function deactivate() { }
