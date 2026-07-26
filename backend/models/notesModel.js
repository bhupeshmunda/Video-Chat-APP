import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    notes: {
        type: String,
    }
})