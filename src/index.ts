import { Compiler, Module, Chunk, Compilation } from 'webpack';
import path from 'path';
import fs from 'fs';
import { WebpackSealAnalyzerPluginOptions, AnalysisData } from './types';
import { ModuleAnalyzer } from './utils/module-analyzer';
import { ChunkAnalyzer } from './utils/chunk-analyzer';
import { BuildAnalyzer } from './utils/build-analyzer';
import { MarkdownFormatter, JsonFormatter, HtmlFormatter } from './formatters';

export default class WebpackSealAnalyzerPlugin {
    private options: WebpackSealAnalyzerPluginOptions;
    private buildStartTime: number;

    constructor(options: WebpackSealAnalyzerPluginOptions = {}) {
        this.options = {
            outputFormat: 'markdown',
            outputFile: 'analysis.md',
            ...options,
        };
        this.buildStartTime = Date.now();
    }

    apply(compiler: Compiler) {
        compiler.hooks.afterEmit.tapAsync('WebpackSealAnalyzerPlugin', (compilation, callback) => {
            try {
                const analysisData = this.collectAnalysisData(compilation);
                const output = this.generateOutput(analysisData);

                const outputFile = this.options.outputFile!;
                const absoluteOutputPath = path.isAbsolute(outputFile)
                    ? outputFile
                    : path.join(compilation.options.output.path!, outputFile);

                fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
                fs.writeFileSync(absoluteOutputPath, output);

                callback();
            } catch (error) {
                callback(error as Error);
            }
        });
    }

    private collectAnalysisData(compilation: Compilation): AnalysisData {
        const modules = Array.from(compilation.modules) as Module[];
        const chunks = Array.from(compilation.chunks) as Chunk[];

        return {
            build: BuildAnalyzer.getBuildInfo(compilation, modules, chunks, this.buildStartTime),
            modules: modules.map(module => ModuleAnalyzer.getModuleInfo(module, compilation)),
            chunks: chunks.map(chunk => ChunkAnalyzer.getChunkInfo(chunk, compilation)),
        };
    }

    private generateOutput(data: AnalysisData): string {
        switch (this.options.outputFormat) {
            case 'json':
                return JsonFormatter.format(data);
            case 'html':
                return HtmlFormatter.format(data);
            case 'markdown':
            default:
                return MarkdownFormatter.format(data);
        }
    }
}
