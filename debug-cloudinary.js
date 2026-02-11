import * as all from 'multer-storage-cloudinary';
import defaultImport from 'multer-storage-cloudinary';

console.log('All exports:', all);
console.log('Default export:', defaultImport);
try {
    const { CloudinaryStorage } = defaultImport;
    console.log('Destructured CloudinaryStorage:', CloudinaryStorage);
} catch (e) {
    console.log('Destructuring failed');
}
