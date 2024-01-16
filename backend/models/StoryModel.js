import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    synopsis: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    tags: {
        type: [String], 
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      }],
},{
    timestamps: true,
});

const Story = mongoose.model('Story', StorySchema);

export default Story;
