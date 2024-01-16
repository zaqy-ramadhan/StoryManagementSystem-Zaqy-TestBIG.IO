import Story from "../models/StoryModel.js";
import upload from '../middlewares/upload.js';
import Chapter from '../models/ChapterModel.js';

export const getStories = async (req, res) => {
    try {
        let filter = {}; // Inisialisasi objek filter

        // Tambahkan filter berdasarkan kategori jika tersedia
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Tambahkan filter berdasarkan status jika tersedia
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const stories = await Story.find(filter);
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getStoryById = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        res.json(story);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const saveStory = async (req, res) => {
    try {
        // Gunakan middleware upload.single('coverImage') untuk menangani unggah gambar
        upload.single('coverImage')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: err });
            }

            try {
                // Ambil data dari body dan dari hasil unggah gambar
                const { title, author, synopsis, category, tags, status } = req.body;
                const coverImage = req.file ? req.file.path : null;

                if (coverImage) {
                    console.log(coverImage)
                    // Menghapus bagian "public/" dari path
                    const cleanPath = coverImage.replace("public", "");

                    // Pisahkan tags yang dipisahkan dengan koma menjadi array
                    const tagsArray = tags.split(',').map(tag => tag.trim());

                    // Buat objek Story dengan data yang diterima
                    const story = new Story({
                        title,
                        author,
                        synopsis,
                        category,
                        tags: tagsArray,
                        status,
                        coverImage: cleanPath, 
                    });

                    // Simpan data Story ke database
                    const insertedStory = await story.save();
                    res.status(201).json(insertedStory);
                } else {
                    res.status(400).json({ message: "Cover image not provided." });
                }
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const updateStory = async (req, res) => {
    try {
        // Gunakan middleware upload.single('coverImage') untuk menangani unggah gambar
        upload.single('coverImage')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: err });
            }

            try {
                // Ambil data dari body dan dari hasil unggah gambar
                const { title, author, synopsis, category, tags, status } = req.body;
                const coverImage = req.file ? req.file.path : null;

                // Cari cerita berdasarkan ID
                const storyId = req.params.id;
                const existingStory = await Story.findById(storyId);

                if (!existingStory) {
                    return res.status(404).json({ message: "Story not found." });
                }

                // Jika ada gambar baru diupload, update coverImage
                if (coverImage) {
                    // Menghapus bagian "public/" dari path
                    const cleanPath = coverImage.replace("public", "");
                    existingStory.coverImage = cleanPath;
                }

                // Update data cerita
                existingStory.title = title;
                existingStory.author = author;
                existingStory.synopsis = synopsis;
                existingStory.category = category;

                // Pisahkan tags yang dipisahkan dengan koma menjadi array
                const tagsArray = tags.split(',').map(tag => tag.trim());
                existingStory.tags = tagsArray;

                existingStory.status = status;

                // Simpan data Story yang telah diupdate ke database
                const updatedStory = await existingStory.save();
                res.status(200).json(updatedStory);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const deleteStory = async (req, res) => {
    try {
        // Temukan dan hapus semua bab terkait dengan cerita
        const chapters = await Chapter.find({ story: req.params.id });
        
        if (chapters.length > 0) {
            const chapterIds = chapters.map(chapter => chapter._id);
            await Chapter.deleteMany({ _id: { $in: chapterIds } });
        }

        const deletedStory = await Story.deleteOne({ _id: req.params.id });
  
      res.status(200).json({ message: 'Story and its chapters deleted successfully.' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

export const uploadCoverImage = async (req, res) => {
    try {
      // Gunakan middleware upload.single('coverImage') untuk menangani unggah gambar
      upload.single('coverImage')(req, res, async function (err) {
        if (err) {
          return res.status(400).json({ message: err });
        }
  
        // Perbarui path gambar cover di database (jika diperlukan)
        const storyId = req.params.id;
        const imagePath = req.file ? req.file.path : null;
  
        if (storyId && imagePath) {
          const updatedStory = await Story.findByIdAndUpdate(storyId, { coverImage: imagePath }, { new: true });
          return res.status(200).json(updatedStory);
        }
  
        res.status(400).json({ message: 'Story ID or image path is missing.' });
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
