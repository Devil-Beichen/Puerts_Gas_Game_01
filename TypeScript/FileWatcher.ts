// 监听Blueprints目录下的文件变化，并自动在MainGame.ts中添加相应的import语句
// npm install --save-dev @types/node   // 安装@types/node
// npm install chokidar                 // 安装chokidar

import * as fs from 'fs';
import * as path from 'path';
import chokidar from 'chokidar';

// Blueprints目录的路径
const BlueprintsDir = path.join(__dirname, './Blueprints');
// MainGame.ts文件的路径
const MainGameFile = path.join(__dirname, './MainGame.ts');

// 检查路径是否正确
console.log(`Watching directory: ${BlueprintsDir}`);
console.log(`MainGame file: ${MainGameFile}`);

// 监听Blueprints目录下的文件变化
const watcher = chokidar.watch(BlueprintsDir, {
    persistent: true,
    ignoreInitial: true
});

watcher.on('add', (filePath) => {
    console.log(`Detected new file: ${filePath}`); // 调试日志

    const relativePath = path.relative(__dirname, filePath);
    const importStatement = `import "./${relativePath.replace(/\\/g, '/').replace(/\.ts$/, "")}";\n`;

    // 读取MainGame.ts文件内容
    fs.readFile(MainGameFile, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading MainGame.ts: ${err.message}`);
            return;
        }

        // 检查是否已经存在相同的import语句
        if (!data.includes(importStatement)) {
            // 在文件末尾添加新的import语句
            fs.appendFile(MainGameFile, importStatement, (err) => {
                if (err) {
                    console.error(`Error appending to MainGame.ts: ${err.message}`);
                    return;
                }
                console.log(`Added import for ${relativePath}`);
            });
        } else {
            console.log(`Import already exists for ${relativePath}`);
        }
    });
});

// 监听错误事件
watcher.on('error', (error) => {
    if (error instanceof Error) {
        console.error(`Watcher error: ${error.message}`);
    } else {
        console.error(`Watcher error: ${error}`);
    }
});
