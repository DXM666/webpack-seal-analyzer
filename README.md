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
      outputFormat: 'html',    // optional: 'html', 'json', or 'markdown'
      outputFile: 'analysis.html'  // optional: output file name
    })
  ]
};
```

## Options

- `outputFormat` (optional): The format of the analysis report
  - Type: `'html' | 'json' | 'markdown'`
  - Default: `'markdown'`
  - Description: Specifies the output format of the analysis report

- `outputFile` (optional): The name of the output file
  - Type: `string`
  - Default: Based on outputFormat (`'analysis.html'`, `'analysis.json'`, or `'analysis.md'`)
  - Description: The name of the file where the analysis report will be generated

## Analysis Report Content

The plugin generates a comprehensive analysis report that includes:

1. Build Information
   - Build duration
   - Total number of modules
   - Total number of chunks
   - Total build size

2. Module Analysis
   - Module identifiers and names
   - Module sizes and types
   - Module dependencies and reasons
   - Import/Export relationships

3. Chunk Analysis
   - Chunk names and IDs
   - Contained modules
   - Parent/Child relationships
   - Entry points

## Example Output

### HTML Format
```html
<!DOCTYPE html>
<html>
<head>
    <title>Webpack Build Analysis</title>
    <!-- Styled with clean, modern CSS -->
</head>
<body>
    <div class="build-info">
        <!-- Build statistics -->
    </div>
    <div class="modules">
        <!-- Module details -->
    </div>
    <div class="chunks">
        <!-- Chunk information -->
    </div>
</body>
</html>
```

### JSON Format
```json
{
  "buildInfo": {
    "duration": 1234,
    "totalModules": 100,
    "totalChunks": 10,
    "totalSize": 1024000
  },
  "modules": [...],
  "chunks": [...]
}
```

### Markdown Format
```markdown
# Webpack Build Analysis

## Build Information
- Duration: 1.234s
- Total Modules: 100
- Total Chunks: 10
...

## Modules
...

## Chunks
...
```

## License

MIT
