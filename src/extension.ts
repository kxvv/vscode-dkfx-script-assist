import * as vscode from 'vscode';
import { MapBrowser } from './MapBrowser';
import { Controller } from './Controller';

export const LANGUAGE_ID = "dks";

export function activate(context: vscode.ExtensionContext) {
	new Controller().subscribe(context);
	new MapBrowser().registerCommand();
}

export function deactivate() { }
