# webpack-seal-analyzer Example

这个示例展示了如何使用 webpack-seal-analyzer 插件来分析 webpack 构建过程中的模块关系。

## 项目结构

```
src/
├── index.js      # 入口文件，包含动态导入
├── moduleA.js    # 被动态导入的模块
└── utils.js      # 公共工具模块
```

## 运行示例

1. 安装依赖：
```bash
npm install
```

2. 运行构建：
```bash
npm run build
```

3. 查看结果：
构建完成后，你可以在 `dist` 目录下找到生成的分析报告：
- `analysis.html`：包含了模块、chunks和依赖关系的可视化报告
