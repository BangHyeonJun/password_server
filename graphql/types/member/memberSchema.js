import mongoose from "mongoose";

const Schema = mongoose.Schema;

// const imageSchema = new mongoose.Schema({
//     path: {
//         type: String,
//         default: ""
//     }
// });

const sns = new Schema({
    url: { type: String, required: false },
    code: { type: Number, required: true },
    image: { type: String, required: true }
});

const memberSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    join_date: { type: Date, required: true },
    avatar: { type: String, required: false },
    introduce: { type: String, required: false },
    sns: [sns],
    role: { type: String, required: false }
});

export default mongoose.model("Member", memberSchema);
