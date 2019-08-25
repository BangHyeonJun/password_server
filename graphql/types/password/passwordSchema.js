import mongoose from "mongoose";

const Schema = mongoose.Schema;

const passwordSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "members" },
    site: { type: String, required: true },
    url: { type: String, required: false },
    id: { type: String, required: true },
    password: { type: String, required: true },
    description: { type: String, required: false }
});

export default mongoose.model("Passwrod", passwordSchema);
