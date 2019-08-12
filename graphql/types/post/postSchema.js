import mongoose from "mongoose";

const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    path: {
        type: String,
        default: ""
    }
});

const postSchema = new Schema({
    writer: { type: String, required: true },
    mainImg: { type: String, required: true },
    hashtag: [{ type: String, required: false }],
    title: { type: String, required: true },
    publish_date: { type: Date, required: true },
    text: { type: String, required: false },
    html: { type: String, required: false },
    comments: [
        new Schema({
            publish_date: { type: Date, required: true },
            name: { type: String, required: true },
            comment: { type: String, required: false }
        })
    ]
});

export default mongoose.model("Post", postSchema);
