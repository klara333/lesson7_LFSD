const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Közös fájlrendszer útvonala
const fileSystemPath = path.join(__dirname, 'uploads');

// Multer beállítása a fájlfeltöltéshez
const storage = multer.diskStorage({
  destination: fileSystemPath,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Képfájlok listázása
app.get('/images', (req, res) => {
  fs.readdir(fileSystemPath, (err, files) => {
    if (err) {
      return res.status(500).send('Error listing images: ' + err.message);
    }
    res.json(files);
  });
});

// Képfájl feltöltése
app.post('/upload', upload.single('image'), (req, res) => {
  res.send('Image uploaded successfully.');
});

// Képfájl letöltése
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(fileSystemPath, req.params.filename);
  res.download(filePath, req.params.filename, (err) => {
    if (err) {
      return res.status(500).send('Error downloading image: ' + err.message);
    }
  });
});

// Képfájl törlése
app.delete('/delete/:filename', (req, res) => {
  const filePath = path.join(fileSystemPath, req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send('Error deleting image: ' + err.message);
    }
    res.send('Image deleted successfully.');
  });
});

// Statikus fájlok szolgáltatása (képek)
app.use('/images', express.static(fileSystemPath));

// Indítsuk el a szervert
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});