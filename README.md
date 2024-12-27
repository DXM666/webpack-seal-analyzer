# webpack-seal-analyzer

A webpack plugin that analyzes and visualizes the relationships between modules, chunks, and module graphs during the seal phase.

## Installation

```bash
npm install webpack-seal-analyzer --save-dev
```

## Usage

```javascript
const WebpackSealAnalyzerPlugin = require('webpack-seal-analyzer');

module.exports = {
  // ... other webpack config
  plugins: [
    new WebpackSealAnalyzerPlugin({
      outputFormat: 'html',  // 'html' or 'markdown'
      outputPath: 'dist'     // output directory
    })
  ]
};
```

## Options

- `outputFormat`: The format of the analysis report. Can be 'html' or 'markdown'. Default: 'html'
- `outputPath`: The directory where the analysis report will be generated. Default: 'dist'

## Output

The plugin will generate an analysis report in the specified format, containing:

1. ChunkGroups Analysis
   - ChunkGroup names and relationships
   - Contained chunks
   - Parent ChunkGroups

2. Chunks Analysis
   - Chunk names
   - Contained modules and their dependencies
   - Entry modules

3. Module Relationship Analysis
   - Module identifiers
   - Module types and sizes
   - Chunk associations
   - Module dependencies
   - Module references

## License

MIT
