const fs = require('fs');
const path = require('path');


// определяем текущую директорию и пути к нужным файлам
const srcDir = path.join(__dirname, '..', './');
const handlerFile = path.join(__dirname, 'AutoImportHandler.js');
const indexFile = path.join(srcDir, 'app.ts');

// функция для обновления AutoImportHandler.js
const updateAutoImportHandler = () => {
    // получаем список файлов в директории src
    const files = fs.readdirSync(srcDir);
    const importStatements = [];

    // формируем импорт только для файлов с расширением .ts, кроме app.ts
    for (const file of files) {
        if (path.extname(file) == '.ts' && file != 'app.ts') {
            const importPath = `./${file.slice(0, -3)}`;
            importStatements.push(`import '${importPath}';`);
        }
    }

    // формируем содержимое AutoImportHandler.js и записываем его в файл
    const handlerContent = `// This file is generated automatically. Please do not modify this file.${importStatements.join('\n')}`;
    fs.writeFileSync(handlerFile, handlerContent);
    console.log('Auto import handler updated successfully');
};

// проверяем, есть ли файл app.ts и, если есть, вызываем функцию обновления AutoImportHandler.js
if (fs.existsSync(indexFile)) {
    updateAutoImportHandler();
} else {
    console.error(`Could not find '${indexFile}'`);
    process.exit(1);
}