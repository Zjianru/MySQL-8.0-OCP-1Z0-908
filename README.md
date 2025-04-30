# MySQL 8.0 OCP 1Z0-908 练习题库

正值 MySQL 30 周年，官方开放了免费的认证渠道。本项目将 PDF 内的题目进行了结构化处理，形成了交互式刷题页面，帮助考生更好地准备 MySQL 8.0 OCP 认证考试。

## 题库来源

感谢国内的开源组织提供的原始题库：
[https://raw.gitcode.com/Open-source-documentation-tutorial/a0043/raw/main/MYSQL%20OCP%208.0%20%E9%A2%98%E5%BA%93.pdf](https://gitcode.com/Open-source-documentation-tutorial/a0043/blob/main/MYSQL%20OCP%208.0%20%E9%A2%98%E5%BA%93.pdf)

## 功能特点

- 📚 完整的 MySQL 8.0 OCP 1Z0-908 考试题库
- ✅ 支持单选题和多选题
- 🎯 实时答题反馈
- 📱 响应式设计，支持移动端访问
- 🔄 题目导航和进度追踪
- 💾 本地数据存储

## 页面预览

![preview](imgs/preview.png)

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Vite

## 项目结构

```
├── public/                 # 静态资源目录
│   └── questions.json     # 题库数据文件
├── src/                   # 源代码目录
│   ├── components/        # React 组件
│   │   └── MySQLPracticeExam.tsx  # 主练习组件
│   ├── styles/           # 样式文件
│   └── App.tsx           # 应用入口
├── pdf_parse/            # PDF 解析工具
│   └── parse_pdf_to_json.py  # PDF 转 JSON 脚本
├── imgs/                 # 图片资源
├── package.json          # 项目依赖配置
└── README.md            # 项目文档
```

## 快速开始

1. 克隆项目
```bash
git clone [项目地址]
cd MySQL-8.0-OCP-1Z0-908
```

2. 安装依赖
```bash
npm install
```

> 如遇依赖安装缓慢，可使用国内镜像源（如 cnpm、pnpm 或 yarn）。

3. 启动开发服务器
```bash
npm run dev
```

4. 访问应用
打开浏览器访问 http://localhost:3000 即可使用刷题页面。

## 开发说明

### PDF 解析工具

项目包含一个 Python 脚本用于将 PDF 格式的题库转换为 JSON 格式。使用方法：

1. 确保已安装 Python 3.8+ 和必要的依赖：
```bash
pip install -r pdf_parse/requirements.txt
```

2. 运行解析脚本：
```bash
python pdf_parse/parse_pdf_to_json.py
```

### 构建生产版本

```bash
npm run build
```

构建后的文件将生成在 `dist` 目录中。

## 注意事项

- 题库数据仅供参考，建议结合官方文档进行学习
- 部分题目可能存在多个正确答案，请仔细阅读题目要求
- 建议使用最新版本的 Chrome 或 Firefox 浏览器访问

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License
