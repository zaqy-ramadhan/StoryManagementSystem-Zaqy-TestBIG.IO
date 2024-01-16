import Chapter from "../models/ChapterModel.js";
import Story from "../models/StoryModel.js";

export const getChapters = async (req, res) => {
    try {
      const storyId = req.params.id;
  
      const chapters = await Chapter.find({ story: storyId });
  
      res.json(chapters);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

export const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    res.json(chapter);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const saveChapter = async (req, res) => {
  try {
    const { title, content, story } = req.body;
    // console.log(req.body);

    if (!title || !content || !story) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const chapter = new Chapter({
      title,
      content,
      story: story,
    });

    const insertedChapter = await chapter.save();

    // Mendapatkan objek story berdasarkan ID
    const existingStory = await Story.findById(story);

    // Memperbarui array chapter di dalam objek story
    existingStory.chapters.push(insertedChapter._id);
    await existingStory.save();

    res.status(201).json(insertedChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const updateChapter = async (req, res) => {
  try {
    const { title, content } = req.body;
    const chapterId = req.params.id;
    const existingChapter = await Chapter.findById(chapterId);

    if (!existingChapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    existingChapter.title = title;
    existingChapter.content = content;

    const updatedChapter = await existingChapter.save();
    res.status(200).json(updatedChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const deleteChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        const storyId = chapter.story;

        if (storyId) {
        await Story.findByIdAndUpdate(storyId, { $pull: { chapters: req.params.id } });
        }
        await Chapter.deleteOne({ _id: req.params.id });;
        res.status(200).json({ message: 'Chapter deleted successfully.' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
