const fs = require('fs');
const path = require('path');

// 清理脚本 - 删除构建产物和临时文件

const dirsToClean = [
    'dist',
    'build',
    'out'
];

const filesToClean = [
    'npm-debug.log',
    'yarn-error.log'
];

function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
        console.log(`✅ 已删除目录: ${folderPath}`);
    }
}

function deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ 已删除文件: ${filePath}`);
    }
}

console.log('🧹 开始清理...\n');

// 清理目录
dirsToClean.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    deleteFolderRecursive(dirPath);
});

// 清理文件
filesToClean.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    deleteFile(filePath);
});

console.log('\n✨ 清理完成！');
