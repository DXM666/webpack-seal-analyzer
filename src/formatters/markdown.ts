import { AnalysisData } from '../types';

export class MarkdownFormatter {
    static format(data: AnalysisData): string {
        let output = '# Webpack Seal Analysis\n\n';

        // Build Info
        output += '## Build Information\n\n';
        output += `- Hash: ${data.build.hash}\n`;
        output += `- Version: ${data.build.version}\n`;
        output += `- Time: ${data.build.time}ms\n`;
        output += `- Built at: ${new Date(data.build.builtAt).toISOString()}\n`;
        output += `- Public Path: ${data.build.publicPath}\n`;
        output += `- Output Path: ${data.build.outputPath}\n\n`;

        // Errors and Warnings
        if (data.build.errors.length > 0) {
            output += '## Errors\n\n';
            data.build.errors.forEach(error => output += `- ${error}\n`);
            output += '\n';
        }

        if (data.build.warnings.length > 0) {
            output += '## Warnings\n\n';
            data.build.warnings.forEach(warning => output += `- ${warning}\n`);
            output += '\n';
        }

        // Modules
        output += '## Modules\n\n';
        data.modules.forEach(module => {
            output += `### ${module.name}\n\n`;
            output += `- ID: ${module.id}\n`;
            output += `- Type: ${module.type}\n`;
            output += `- Size: ${module.size} bytes\n`;
            if (module.exports.length > 0) {
                output += `- Exports: ${module.exports.join(', ')}\n`;
            }
            if (module.dependencies.length > 0) {
                output += `- Dependencies:\n`;
                module.dependencies.forEach(dep => output += `  - ${dep}\n`);
            }
            if (module.reasons.length > 0) {
                output += `- Reasons:\n`;
                module.reasons.forEach(reason => output += `  - ${reason}\n`);
            }
            if (module.optimizationBailout.length > 0) {
                output += `- Optimization Bailout:\n`;
                module.optimizationBailout.forEach(bailout => output += `  - ${bailout}\n`);
            }
            if (module.circularDependencies.length > 0) {
                output += `- Circular Dependencies:\n`;
                module.circularDependencies.forEach(cycle => output += `  - ${cycle.join(' -> ')}\n`);
            }
            if (module.duplicateDependencies.length > 0) {
                output += `- Duplicate Dependencies:\n`;
                module.duplicateDependencies.forEach(dep => output += `  - ${dep}\n`);
            }
            output += '\n';
        });

        // Chunks
        output += '## Chunks\n\n';
        data.chunks.forEach(chunk => {
            output += `### ${chunk.name || chunk.id}\n\n`;
            output += `- Size: ${chunk.size} bytes\n`;
            output += `- Files: ${chunk.files.join(', ')}\n`;
            output += `- Parents: ${chunk.parents.join(', ') || 'none'}\n`;
            output += `- Children: ${chunk.children.join(', ') || 'none'}\n`;
            output += `- Siblings: ${chunk.siblings.join(', ') || 'none'}\n`;
            output += `- Entry Points: ${chunk.entrypoints.join(', ') || 'none'}\n\n`;
        });

        // Performance
        output += '## Performance\n\n';
        output += `- Build Time: ${data.build.performance.buildTime}ms\n`;
        output += `- Module Count: ${data.build.performance.moduleCount}\n`;
        output += `- Chunk Count: ${data.build.performance.chunkCount}\n`;
        output += `- Asset Count: ${data.build.performance.assetCount}\n`;
        output += `- Total Size: ${data.build.performance.totalSize} bytes\n`;
        output += `- Average Module Size: ${data.build.performance.averageModuleSize} bytes\n`;
        output += `- Largest Modules:\n`;
        data.build.performance.largestModules.forEach(module => output += `  - ${module.name} (${module.size} bytes)\n`);
        output += `- Slowest Modules:\n`;
        data.build.performance.slowestModules.forEach(module => output += `  - ${module.name} (${module.buildTime}ms)\n`);

        return output;
    }
}
