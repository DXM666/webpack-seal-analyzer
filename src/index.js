const fs = require('fs');
const path = require('path');

/**
 * Webpack插件，用于分析和可视化模块、chunks和依赖关系
 * @typedef {Object} WebpackSealAnalyzerOptions
 * @property {('html'|'markdown')} [outputFormat='html'] - 输出格式
 * @property {string} [outputPath='dist'] - 输出目录路径
 */
class WebpackSealAnalyzerPlugin {
    /**
     * @param {WebpackSealAnalyzerOptions} [options]
     */
    constructor(options = {}) {
        this.options = {
            outputFormat: options.outputFormat || 'html',
            outputPath: options.outputPath || 'dist'
        };
    }

    /**
     * @param {import('webpack').Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.compilation.tap('WebpackSealAnalyzerPlugin', (compilation) => {
            compilation.hooks.afterSeal.tap('WebpackSealAnalyzerPlugin', () => {
                // 收集分析数据
                const analysisData = this.collectAnalysisData(compilation);
                
                // 确保输出目录存在
                const outputDir = path.resolve(this.options.outputPath);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                // 根据输出格式生成文件
                if (this.options.outputFormat === 'html') {
                    const htmlContent = this.generateHTML(analysisData);
                    fs.writeFileSync(path.join(outputDir, 'analysis.html'), htmlContent);
                } else if (this.options.outputFormat === 'markdown') {
                    const markdownContent = this.generateMarkdown(analysisData);
                    fs.writeFileSync(path.join(outputDir, 'analysis.md'), markdownContent);
                }
            });
        });
    }

    /**
     * 收集编译过程中的分析数据
     * @param {import('webpack').Compilation} compilation
     * @returns {Object} 分析数据
     */
    collectAnalysisData(compilation) {
        const data = {
            chunkGroups: [],
            chunks: [],
            modules: []
        };

        // 1. 收集ChunkGroups信息
        compilation.chunkGroups.forEach(chunkGroup => {
            const groupData = {
                name: chunkGroup.name || '(unnamed)',
                chunks: chunkGroup.chunks.map(chunk => ({
                    name: chunk.name || chunk.id
                })),
                parents: chunkGroup.getParents().map(parent => ({
                    name: parent.name || '(unnamed)'
                }))
            };
            data.chunkGroups.push(groupData);
        });

        // 2. 收集Chunks信息
        compilation.chunks.forEach(chunk => {
            const chunkGraph = compilation.chunkGraph;
            const modules = chunkGraph.getChunkModules(chunk);
            
            const chunkData = {
                name: chunk.name || chunk.id,
                modules: modules.map(module => {
                    const moduleData = {
                        identifier: module.request || module.identifier(),
                        dependencies: []
                    };

                    // 收集模块依赖
                    if (module.dependencies) {
                        module.dependencies.forEach(dep => {
                            if (dep.request) {
                                moduleData.dependencies.push(dep.request);
                            }
                        });
                    }

                    return moduleData;
                }),
                entryModules: Array.from(chunkGraph.getChunkEntryModulesIterable(chunk) || [])
                    .map(module => module.request || module.identifier())
            };
            data.chunks.push(chunkData);
        });

        // 3. 收集模块关系
        compilation.modules.forEach(module => {
            const chunkGraph = compilation.chunkGraph;
            const containingChunks = Array.from(chunkGraph.getModuleChunks(module));
            
            const moduleData = {
                identifier: module.request || module.identifier(),
                chunks: containingChunks.map(chunk => chunk.name || chunk.id),
                size: module.size(),
                type: module.type,
                dependencies: module.dependencies
                    ?.filter(dep => dep.request)
                    ?.map(dep => dep.request) || [],
                reasons: Array.from(compilation.moduleGraph.getIncomingConnections(module))
                    .map(connection => ({
                        module: connection.originModule?.identifier(),
                        type: connection.dependency?.type
                    }))
                    .filter(reason => reason.module)
            };
            data.modules.push(moduleData);
        });

        return data;
    }

    /**
     * 生成HTML格式的分析报告
     * @param {Object} data - 分析数据
     * @returns {string} HTML内容
     */
    generateHTML(data) {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Webpack Seal Analysis</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .section { margin-bottom: 30px; }
        .item { 
            border: 1px solid #ddd;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            background: #f8f9fa;
        }
        .sub-item {
            margin-left: 20px;
            padding: 5px 0;
        }
        h2 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px; }
        h3 { color: #666; }
        .tree-line { color: #666; }
    </style>
</head>
<body>
    <h1>Webpack Seal Analysis</h1>
    
    <div class="section">
        <h2>1. ChunkGroups分析</h2>
        ${data.chunkGroups.map(group => `
            <div class="item">
                <h3>ChunkGroup: ${group.name}</h3>
                <div class="sub-item">
                    <strong>包含的Chunks:</strong>
                    <ul>
                        ${group.chunks.map(chunk => `
                            <li>${chunk.name}</li>
                        `).join('')}
                    </ul>
                    ${group.parents.length ? `
                        <strong>父ChunkGroup:</strong>
                        <ul>
                            ${group.parents.map(parent => `
                                <li>${parent.name}</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>2. Chunks分析</h2>
        ${data.chunks.map(chunk => `
            <div class="item">
                <h3>Chunk: ${chunk.name}</h3>
                <div class="sub-item">
                    <strong>包含的Modules:</strong>
                    <ul>
                        ${chunk.modules.map(module => `
                            <li>
                                ${module.identifier}
                                ${module.dependencies.length ? `
                                    <div class="sub-item">
                                        <strong>依赖:</strong>
                                        <ul>
                                            ${module.dependencies.map(dep => `
                                                <li>${dep}</li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                            </li>
                        `).join('')}
                    </ul>
                    ${chunk.entryModules.length ? `
                        <strong>入口模块:</strong>
                        <ul>
                            ${chunk.entryModules.map(module => `
                                <li>${module}</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>3. 模块关系分析</h2>
        ${data.modules.map(module => `
            <div class="item">
                <h3>模块: ${module.identifier}</h3>
                <div class="sub-item">
                    <p><strong>类型:</strong> ${module.type}</p>
                    <p><strong>大小:</strong> ${module.size} bytes</p>
                    ${module.chunks.length ? `
                        <strong>所属Chunks:</strong>
                        <ul>
                            ${module.chunks.map(chunk => `
                                <li>${chunk}</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                    ${module.dependencies.length ? `
                        <strong>依赖:</strong>
                        <ul>
                            ${module.dependencies.map(dep => `
                                <li>${dep}</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                    ${module.reasons.length ? `
                        <strong>被引用原因:</strong>
                        <ul>
                            ${module.reasons.map(reason => `
                                <li>被 ${reason.module} 引用 (${reason.type})</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
    }

    /**
     * 生成Markdown格式的分析报告
     * @param {Object} data - 分析数据
     * @returns {string} Markdown内容
     */
    generateMarkdown(data) {
        return `# Webpack Seal Analysis

## 1. ChunkGroups分析

${data.chunkGroups.map(group => `
### ChunkGroup: ${group.name}

#### 包含的Chunks:
${group.chunks.map(chunk => `- ${chunk.name}`).join('\n')}

${group.parents.length ? `#### 父ChunkGroup:
${group.parents.map(parent => `- ${parent.name}`).join('\n')}` : ''}
`).join('\n')}

## 2. Chunks分析

${data.chunks.map(chunk => `
### Chunk: ${chunk.name}

#### 包含的Modules:
${chunk.modules.map(module => `
- ${module.identifier}
${module.dependencies.length ? `  依赖:
${module.dependencies.map(dep => `    - ${dep}`).join('\n')}` : ''}`).join('\n')}

${chunk.entryModules.length ? `#### 入口模块:
${chunk.entryModules.map(module => `- ${module}`).join('\n')}` : ''}
`).join('\n')}

## 3. 模块关系分析

${data.modules.map(module => `
### 模块: ${module.identifier}

- 类型: ${module.type}
- 大小: ${module.size} bytes

${module.chunks.length ? `#### 所属Chunks:
${module.chunks.map(chunk => `- ${chunk}`).join('\n')}` : ''}

${module.dependencies.length ? `#### 依赖:
${module.dependencies.map(dep => `- ${dep}`).join('\n')}` : ''}

${module.reasons.length ? `#### 被引用原因:
${module.reasons.map(reason => `- 被 ${reason.module} 引用 (${reason.type})`).join('\n')}` : ''}
`).join('\n')}`;
    }
}

module.exports = WebpackSealAnalyzerPlugin;
