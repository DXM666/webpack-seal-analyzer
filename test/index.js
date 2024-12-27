const { describe, test, beforeEach ,expect} = require('@jest/globals');
const WebpackSealAnalyzerPlugin = require('../src');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

describe('WebpackSealAnalyzerPlugin', () => {
    const outputPath = path.resolve(__dirname, 'dist');
    
    beforeEach(() => {
        // 清理测试目录
        if (fs.existsSync(outputPath)) {
            fs.rmSync(outputPath, { recursive: true });
        }
    });

    test('should generate analysis files', (done) => {
        const compiler = webpack({
            mode: 'development',
            entry: path.resolve(__dirname, 'fixtures/index.js'),
            output: {
                path: outputPath,
                filename: '[name].bundle.js'
            },
            plugins: [
                new WebpackSealAnalyzerPlugin({
                    outputPath: outputPath
                })
            ]
        });

        compiler.run((err) => {
            expect(err).toBeNull();
            expect(fs.existsSync(path.join(outputPath, 'analysis.html'))).toBeTruthy();
            
            const htmlContent = fs.readFileSync(path.join(outputPath, 'analysis.html'), 'utf-8');
            expect(htmlContent).toContain('Webpack Seal Analysis');
            
            compiler.close(() => done());
        });
    });

    test('should support markdown output', (done) => {
        const compiler = webpack({
            mode: 'development',
            entry: path.resolve(__dirname, 'fixtures/index.js'),
            output: {
                path: outputPath,
                filename: '[name].bundle.js'
            },
            plugins: [
                new WebpackSealAnalyzerPlugin({
                    outputFormat: 'markdown',
                    outputPath: outputPath
                })
            ]
        });

        compiler.run((err) => {
            expect(err).toBeNull();
            expect(fs.existsSync(path.join(outputPath, 'analysis.md'))).toBeTruthy();
            
            const mdContent = fs.readFileSync(path.join(outputPath, 'analysis.md'), 'utf-8');
            expect(mdContent).toContain('# Webpack Seal Analysis');
            
            compiler.close(() => done());
        });
    });
});
