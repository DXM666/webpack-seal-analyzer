import { Module, Chunk, ChunkGroup } from 'webpack';

export interface WebpackSealAnalyzerPluginOptions {
    outputFormat?: 'markdown' | 'json' | 'html';
    outputFile?: string;
}

export interface ModuleInfo {
    id: string;
    type: string;
    size: number;
    name: string;
    dependencies: string[];
    exports: string[];
    issuerPath: string[];
    reasons: string[];
    optimizationBailout: string[];
    circularDependencies: string[][];
    duplicateDependencies: string[];
}

export interface ChunkInfo {
    id: string | number | null;
    name: string | undefined;
    size: number;
    files: string[];
    modules: string[];
    parents: string[];
    children: string[];
    siblings: string[];
    entrypoints: string[];
}

export interface BuildPerformance {
    buildTime: number;
    moduleCount: number;
    chunkCount: number;
    assetCount: number;
    totalSize: number;
    averageModuleSize: number;
    largestModules: Array<{name: string, size: number}>;
    slowestModules: Array<{name: string, buildTime: number}>;
}

export interface BuildInfo {
    hash: string;
    version: string;
    time: number;
    builtAt: number;
    publicPath: string;
    outputPath: string;
    assetsByChunkName: Record<string, string[]>;
    entrypoints: string[];
    errors: string[];
    warnings: string[];
    performance: BuildPerformance;
}

export interface AnalysisData {
    build: BuildInfo;
    modules: ModuleInfo[];
    chunks: ChunkInfo[];
}
