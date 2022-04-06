import * as vscode from 'vscode';
import { MapBrowser } from './MapBrowser';
import { Resolver } from './Resolver';

export const LANGUAGE_ID = "dks";

export function activate(context: vscode.ExtensionContext) {
	new Resolver().subscribe(context);
	new MapBrowser().registerCommand();
}

export function deactivate() { }
