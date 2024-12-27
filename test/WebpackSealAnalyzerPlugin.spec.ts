import path from 'path';
import webpack from 'webpack';
import WebpackSealAnalyzerPlugin from '../src';
import fs from 'fs';

describe('WebpackSealAnalyzerPlugin', () => {
    const outputPath = path.resolve(__dirname, 'fixtures/dist');
    
    beforeEach(() => {
        // 清理测试目录
        if (fs.existsSync(outputPath)) {
            fs.rmSync(outputPath, { recursive: true });
        }
        fs.mkdirSync(outputPath, { recursive: true });
    });

    afterEach(() => {
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
                filename: '[name].js',
            },
            plugins: [
                new WebpackSealAnalyzerPlugin({
                    outputFile: 'analysis.md'
                })
            ],
        });

        compiler.run((err, stats) => {
            try {
                expect(err).toBeNull();
                expect(stats?.hasErrors()).toBe(false);

                const analysisFile = path.join(outputPath, 'analysis.md');
                expect(fs.existsSync(analysisFile)).toBe(true);
                
                const content = fs.readFileSync(analysisFile, 'utf-8');
                expect(content).toContain('# Webpack Seal Analysis');
                
                compiler.close((closeErr) => {
                    expect(closeErr).toBeNull();
                    done();
                });
            } catch (error) {
                compiler.close(() => done(error));
            }
        });
    }, 30000);

    test('should support different output formats', (done) => {
        const compiler = webpack({
            mode: 'development',
            entry: path.resolve(__dirname, 'fixtures/index.js'),
            output: {
                path: outputPath,
                filename: '[name].js',
            },
            plugins: [
                new WebpackSealAnalyzerPlugin({
                    outputFormat: 'json',
                    outputFile: 'analysis.json',
                }),
            ],
        });

        compiler.run((err, stats) => {
            try {
                expect(err).toBeNull();
                expect(stats?.hasErrors()).toBe(false);

                const analysisFile = path.join(outputPath, 'analysis.json');
                expect(fs.existsSync(analysisFile)).toBe(true);
                
                const content = fs.readFileSync(analysisFile, 'utf-8');
                expect(() => JSON.parse(content)).not.toThrow();
                
                const data = JSON.parse(content);
                expect(data).toHaveProperty('build');
                expect(data).toHaveProperty('modules');
                expect(data).toHaveProperty('chunks');
                
                compiler.close((closeErr) => {
                    expect(closeErr).toBeNull();
                    done();
                });
            } catch (error) {
                compiler.close(() => done(error));
            }
        });
    }, 30000);
});
