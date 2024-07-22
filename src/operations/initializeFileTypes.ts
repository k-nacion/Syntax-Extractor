import * as vscode from 'vscode';
import { ConfigManager, ConfigKey } from '../config/ConfigManager';

export async function initializeFileTypeConfiguration() {
    const configManager = ConfigManager.getInstance();
    const fileTypes = configManager.getValue(ConfigKey.FileTypesAndFoldersToCheck) as string[];

    if (fileTypes.length === 0) {
        const detectedTypes = await detectWorkspaceFileTypes();
        await configManager.setValue(ConfigKey.FileTypesAndFoldersToCheck, detectedTypes);
    }
}

export async function detectWorkspaceFileTypes(): Promise<string[]> {
    const files = await vscode.workspace.findFiles('**/*', '**/node_modules/**', 1000);
    const fileTypes = files.map(file => {
        const parts = file.path.split('.');
        return parts.length > 1 ? `.${parts.pop()}` : '';
    }).filter((value): value is string => value !== '');
    return [...new Set(fileTypes)];
}