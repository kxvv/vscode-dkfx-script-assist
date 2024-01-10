import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { MBMInitial, MBMMap, MBMType } from "./model/MapBrowserMessages";
import { ResourcesLoader } from "./ResourcesLoader";
import { SyntaxToken } from "./model/Token";

export class MapBrowser {
    private lastActiveEditorPath = "";
    private browserViewHtml = "";
    private panel: vscode.WebviewPanel | null = null;

    registerCommand() {
        vscode.commands.registerCommand("dks.browse", () => {
            this.panel = vscode.window.createWebviewPanel(
                "dkAssistMapBrowser",
                "Browse DK maps",
                vscode.ViewColumn.Active,
                {
                    enableScripts: true,
                    retainContextWhenHidden: false
                }
            );
            this.panel.webview.html = this.getViewHtml();
            this.panel.webview.postMessage(this.createMsgInitial());
            this.panel.webview.onDidReceiveMessage(map => this.handleMapChosen(map));
        });
    }

    private handleMapChosen(map: MBMMap) {
        if (this.panel) {
            this.panel.dispose();
            vscode.workspace.openTextDocument(vscode.Uri.file(map.path))
                .then(doc => vscode.window.showTextDocument(doc, vscode.ViewColumn.Active));
        }
    }

    private createMsgInitial(): MBMInitial {
        return {
            type: MBMType.Build,
            maps: this.loadMaps()
        };
    }

    private getTitleFromLifContent(content: string): string {
        /*
            Detect lif format:
            453, #207
            ;Desperation
         */
        if (content.includes("\n;")) {
            return content.split("\n;")[1].trim();
        }
        /*
            Else fallback to lif format:
            453, Desperation
        */
        else if (content.includes(SyntaxToken.ArgSep)) {
            return content.split(SyntaxToken.ArgSep)[1].trim();
        }
        return "";
    }

    private loadMaps(): MBMMap[] {
        this.lastActiveEditorPath = vscode.window.activeTextEditor?.document?.fileName || this.lastActiveEditorPath;
        if (!this.lastActiveEditorPath) {
            return [];
        }
        const dirPath = path.dirname(this.lastActiveEditorPath);
        const allFileNames = fs.readdirSync(dirPath);
        const scriptFileNames = allFileNames.filter(f => /map\d+\.txt/gi.test(f));
        return scriptFileNames.map(f => {
            const mapNum = f.match(/\d+/)?.[0] || "-1";
            const lifFilename = allFileNames.filter(lif => /\.lif/i.test(lif) && new RegExp(mapNum).test(lif))[0];
            let title = "";
            if (lifFilename) {
                const lifPath = path.join(dirPath, lifFilename);
                title = this.getTitleFromLifContent(ResourcesLoader.loadFileContents(lifPath));
            }
            return {
                name: f,
                path: path.join(dirPath, f),
                title,
            };
        });
    }


    private getViewHtml() {
        if (!this.browserViewHtml) {
            this.browserViewHtml = ResourcesLoader.loadMapBrowserViewHtml();
        }
        return this.browserViewHtml;
    }
}