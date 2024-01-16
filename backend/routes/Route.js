import express from 'express';
import * as storyController from '../controllers/storyController.js';
import * as chapterController from '../controllers/chapterController.js';

const router = express.Router();

// Rute untuk Story
router.get('/stories', storyController.getStories);
router.get('/stories/:id', storyController.getStoryById);
router.post('/stories', storyController.saveStory);
router.patch('/stories/:id', storyController.updateStory);
router.delete('/stories/:id', storyController.deleteStory);

// Rute untuk Chapter
router.get('/stories/:id/chapters', chapterController.getChapters);
router.get('/chapters/:id', chapterController.getChapterById);
router.post('/chapters', chapterController.saveChapter);
router.patch('/chapters/:id', chapterController.updateChapter);
router.delete('/chapters/:id', chapterController.deleteChapter);

// Rute untuk unggah gambar cover story
router.post('/stories/:id/upload-cover', storyController.uploadCoverImage);

// Endpoint untuk mengambil gambar berdasarkan nama file
router.get("/images/:filename", (req, res) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, `../${filename}`);
  
    // Mengirim gambar sebagai respons
    res.sendFile(imagePath);
});

export default router;
