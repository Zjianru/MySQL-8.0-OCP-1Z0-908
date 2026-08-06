

# MySQL 8.0 OCP 1Z0-908 Practice Question Bank

In celebration of MySQL's 30th anniversary, official certification pathways have been opened for free. This project structures the questions from the PDF into an interactive practice page to help candidates better prepare for the MySQL 8.0 OCP certification exam.

## Question Bank Source

Thanks to the open-source community for providing the original question bank:
[https://raw.gitcode.com/Open-source-documentation-tutorial/a0043/raw/main/MYSQL%20OCP%208.0%20%E9%A2%98%E5%BA%93.pdf](https://gitcode.com/Open-source-documentation-tutorial/a0043/blob/main/MYSQL%20OCP%208.0%20%E9%A2%98%E5%BA%93.pdf)

## Features

- 📚 Complete MySQL 8.0 OCP 1Z0-908 question bank
- ✅ Supports single-choice and multiple-choice questions
- 🎯 Real-time answer feedback
- 📱 Responsive design with mobile support
- 🔄 Question navigation and progress tracking
- 💾 Local data storage

## Preview

![preview](imgs/preview.png)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Vite

## Project Structure

```
├── public/                 # Static assets directory
│   └── questions.json     # Question bank data file
├── src/                   # Source code directory
│   ├── components/        # React components
│   │   └── MySQLPracticeExam.tsx  # Main practice component
│   ├── styles/           # Style files
│   └── App.tsx           # Application entry point
├── pdf_parse/            # PDF parsing utility
│   └── parse_pdf_to_json.py  # PDF to JSON conversion script
├── imgs/                 # Image assets
├── package.json          # Project dependency configuration
└── README.md            # Project documentation
```

## Quick Start

1. Clone the repository
```bash
git clone [project-url]
cd MySQL-8.0-OCP-1Z0-908
```

2. Install dependencies
```bash
npm install
```

> If dependency installation is slow, you can use alternative mirror sources (e.g., cnpm, pnpm, or yarn).

3. Start the development server
```bash
npm run dev
```

4. Access the application
Open your browser and visit http://localhost:3000 to start practicing.

## Development Notes

### PDF Parsing Tool

The project includes a Python script to convert the PDF question bank into JSON format. Usage:

1. Ensure Python 3.8+ and necessary dependencies are installed:
```bash
pip install -r pdf_parse/requirements.txt
```

2. Run the parsing script:
```bash
python pdf_parse/parse_pdf_to_json.py
```

### Build for Production

```bash
npm run build
```

The built files will be generated in the `dist` directory.

## Notes

- The question bank data is for reference only; it is recommended to study alongside the official documentation.
- Some questions may have multiple correct answers; please read the question requirements carefully.
- It is recommended to access the application using the latest versions of Chrome or Firefox.

## Contribution Guidelines

Issues and Pull Requests are welcome to help improve the project.

## License

MIT License
