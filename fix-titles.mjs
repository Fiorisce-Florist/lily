import fs from 'fs';
import path from 'path';

const appDir = "c:\\Users\\anand\\CSUI\\PROJECTS\\lily\\src\\app";

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('page.tsx')) {
      filelist.push(dirFile);
    }
  }
  return filelist;
}

const pages = walkSync(appDir);

pages.forEach(page => {
  let content = fs.readFileSync(page, 'utf8');
  let original = content;

  // Replace various suffix patterns
  content = content.replace(/title:\s*['"](.+?)\s*(?:—|-|\|)\s*Fiorisce['"]/g, 'title: "$1"');
  content = content.replace(/title:\s*['"]Fiorisce\s*(?:—|-|\|)\s*(.+?)['"]/g, 'title: "$1"');
  content = content.replace(/title:\s*['"](.+?)\s*\|\s*Admin(?: Dashboard)?['"]/g, 'title: "$1"');
  
  // Specific fixes
  const normalizedPage = page.replace(/\\/g, '/');
  
  if (normalizedPage.endsWith('cart/page.tsx')) {
     content = content.replace(/title:\s*['"]Fiorisce['"]/, 'title: "Cart"');
  }

  // root page.tsx
  if (normalizedPage.endsWith('src/app/page.tsx')) {
     content = content.replace(/title:\s*['"]Fiorisce — Handcrafted Floral Arrangements['"]/, 'title: { absolute: "Fiorisce — Handcrafted Floral Arrangements" }');
  }

  // shop/[slug]/page.tsx
  content = content.replace(/title:\s*`\$\{product\.name\}\s*(?:—|-|\|)\s*Fiorisce`/g, 'title: `${product.name}`');

  if (content !== original) {
    fs.writeFileSync(page, content);
    console.log(`Updated ${page}`);
  }
});
