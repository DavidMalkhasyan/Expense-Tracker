const fs = require('fs');

class FileService {
  static saveToFile(filePath, data) {
    if (!filePath) throw new Error('File path is undefined');
    try {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      } else {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error(`${filePath}:`, e.message);
    }
  }
  

  static loadFromFile(filePath) {
    if (!filePath || !fs.existsSync(filePath)) {
        return {}; 
    }
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        if (!rawData.trim()) {  
            return {};  
        }
        return JSON.parse(rawData);
    } catch (e) {
        console.error(`${filePath}:`, e.message);
        return {}; 
    }
}

}

module.exports = FileService;
