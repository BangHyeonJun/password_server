import mongoose from "mongoose";

const Schema = mongoose.Schema;

const memberSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});

export default mongoose.model("Member", memberSchema);
