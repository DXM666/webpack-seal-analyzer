import { Module, Chunk, Compilation } from 'webpack';
import { BuildInfo } from '../types';

export class BuildAnalyzer {
    static getBuildInfo(compilation: Compilation, modules: Module[], chunks: Chunk[], buildStartTime: number): BuildInfo {
        const hash = compilation.hash || '';
        const stats = compilation.getStats();
        const { startTime = 0, endTime = Date.now() } = stats;
        
        // 收集性能指标
        const modulesBuildTime = new Map<Module, number>();
        modules.forEach(module => {
            const buildInfo = (module as any).buildInfo;
            if (buildInfo && buildInfo.buildTime) {
                modulesBuildTime.set(module, buildInfo.buildTime);
            }
        });

        const totalSize = modules.reduce((sum, module) => sum + module.size(), 0);
        const averageModuleSize = totalSize / modules.length;

        const largestModules = modules
            .map(module => ({ name: module.identifier(), size: module.size() }))
            .sort((a, b) => b.size - a.size)
            .slice(0, 10);

        const slowestModules = Array.from(modulesBuildTime.entries())
            .map(([module, time]) => ({ name: module.identifier(), buildTime: time }))
            .sort((a, b) => b.buildTime - a.buildTime)
            .slice(0, 10);

        return {
            hash,
            version: '5.0.0', // 使用固定版本号
            time: endTime - startTime,
            builtAt: endTime,
            publicPath: compilation.outputOptions.publicPath as string || '',
            outputPath: compilation.outputOptions.path || '',
            assetsByChunkName: compilation.getStats().toJson().assetsByChunkName || {},
            entrypoints: Array.from(compilation.entrypoints.keys()),
            errors: compilation.getErrors().map(error => error.message),
            warnings: compilation.getWarnings().map(warning => warning.message),
            performance: {
                buildTime: Date.now() - buildStartTime,
                moduleCount: modules.length,
                chunkCount: chunks.length,
                assetCount: Object.keys(compilation.assets).length,
                totalSize,
                averageModuleSize,
                largestModules,
                slowestModules,
            },
        };
    }
}
