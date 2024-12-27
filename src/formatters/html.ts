import { AnalysisData } from '../types';
import fs from 'fs';
import path from 'path';

export class HtmlFormatter {
    static format(data: AnalysisData): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Webpack Build Analysis</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        h1, h2, h3, h4 {
            color: #2c3e50;
            margin-top: 1.5em;
        }

        .section {
            margin-bottom: 2em;
            padding: 1em;
            background: #f8f9fa;
            border-radius: 4px;
        }

        .item {
            margin-bottom: 1em;
            padding: 1em;
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 4px;
        }

        .list {
            list-style-type: none;
            padding-left: 0;
        }

        .list li {
            padding: 0.5em;
            border-bottom: 1px solid #eee;
        }

        .list li:last-child {
            border-bottom: none;
        }

        .error {
            color: #dc3545;
        }

        .warning {
            color: #ffc107;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Webpack Build Analysis</h1>

        <!-- Build Info -->
        <div class="section">
            <h2>Build Information</h2>
            <div class="item">
                <p><strong>Hash:</strong> ${data.build.hash}</p>
                <p><strong>Version:</strong> ${data.build.version}</p>
                <p><strong>Time:</strong> ${data.build.time}ms</p>
                <p><strong>Built at:</strong> ${new Date(data.build.builtAt).toISOString()}</p>
                <p><strong>Public Path:</strong> ${data.build.publicPath}</p>
                <p><strong>Output Path:</strong> ${data.build.outputPath}</p>
            </div>
        </div>

        <!-- Errors -->
        ${data.build.errors.length > 0 ? `
        <div class="section">
            <h2>Errors</h2>
            <div class="item">
                <ul class="list error">
                    ${data.build.errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        </div>
        ` : ''}

        <!-- Warnings -->
        ${data.build.warnings.length > 0 ? `
        <div class="section">
            <h2>Warnings</h2>
            <div class="item">
                <ul class="list warning">
                    ${data.build.warnings.map(warning => `<li>${warning}</li>`).join('')}
                </ul>
            </div>
        </div>
        ` : ''}

        <!-- Modules -->
        <div class="section">
            <h2>Modules</h2>
            ${data.modules.map(module => `
                <div class="item">
                    <h3>${module.name}</h3>
                    <p><strong>ID:</strong> ${module.id}</p>
                    <p><strong>Type:</strong> ${module.type}</p>
                    <p><strong>Size:</strong> ${module.size} bytes</p>

                    ${module.exports.length > 0 ? `
                        <h4>Exports</h4>
                        <ul class="list">
                            ${module.exports.map(exp => `<li>${exp}</li>`).join('')}
                        </ul>
                    ` : ''}

                    ${module.dependencies.length > 0 ? `
                        <h4>Dependencies</h4>
                        <ul class="list">
                            ${module.dependencies.map(dep => `<li>${dep}</li>`).join('')}
                        </ul>
                    ` : ''}

                    ${module.reasons.length > 0 ? `
                        <h4>Reasons</h4>
                        <ul class="list">
                            ${module.reasons.map(reason => `<li>${reason}</li>`).join('')}
                        </ul>
                    ` : ''}

                    ${module.optimizationBailout.length > 0 ? `
                        <h4>Optimization Bailout</h4>
                        <ul class="list">
                            ${module.optimizationBailout.map(bailout => `<li>${bailout}</li>`).join('')}
                        </ul>
                    ` : ''}

                    ${module.circularDependencies.length > 0 ? `
                        <h4>Circular Dependencies</h4>
                        <ul class="list">
                            ${module.circularDependencies.map(cycle => `<li>${cycle.join(' -> ')}</li>`).join('')}
                        </ul>
                    ` : ''}

                    ${module.duplicateDependencies.length > 0 ? `
                        <h4>Duplicate Dependencies</h4>
                        <ul class="list">
                            ${module.duplicateDependencies.map(dep => `<li>${dep}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('')}
        </div>

        <!-- Chunks -->
        <div class="section">
            <h2>Chunks</h2>
            ${data.chunks.map(chunk => `
                <div class="item">
                    <h3>${chunk.name || chunk.id}</h3>
                    <p><strong>Size:</strong> ${chunk.size} bytes</p>
                    <p><strong>Files:</strong> ${chunk.files.join(', ')}</p>
                    <p><strong>Parents:</strong> ${chunk.parents.join(', ') || 'none'}</p>
                    <p><strong>Children:</strong> ${chunk.children.join(', ') || 'none'}</p>
                    <p><strong>Siblings:</strong> ${chunk.siblings.join(', ') || 'none'}</p>
                    <p><strong>Entry Points:</strong> ${chunk.entrypoints.join(', ') || 'none'}</p>
                </div>
            `).join('')}
        </div>

        <!-- Performance -->
        <div class="section">
            <h2>Performance</h2>
            <div class="item">
                <p><strong>Build Time:</strong> ${data.build.performance.buildTime}ms</p>
                <p><strong>Module Count:</strong> ${data.build.performance.moduleCount}</p>
                <p><strong>Chunk Count:</strong> ${data.build.performance.chunkCount}</p>
                <p><strong>Asset Count:</strong> ${data.build.performance.assetCount}</p>
                <p><strong>Total Size:</strong> ${data.build.performance.totalSize} bytes</p>
                <p><strong>Average Module Size:</strong> ${data.build.performance.averageModuleSize} bytes</p>
                <h4>Largest Modules</h4>
                <ul class="list">
                    ${data.build.performance.largestModules.map(module => `<li>${module.name} (${module.size} bytes)</li>`).join('')}
                </ul>
                <h4>Slowest Modules</h4>
                <ul class="list">
                    ${data.build.performance.slowestModules.map(module => `<li>${module.name} (${module.buildTime}ms)</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>

    <script>
        // 可以在这里添加交互功能
    </script>
</body>
</html>`;
    }
}
