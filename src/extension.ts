import * as vscode from 'vscode';
import { MapBrowser } from './MapBrowser';
import { Gate } from './Gate';

export const LANGUAGE_ID = "dks";

export function activate(context: vscode.ExtensionContext) {
	new Gate().subscribe(context);
	new MapBrowser().registerCommand();
}

export function deactivate() { }
