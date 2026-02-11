import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    cropType: {
        type: String,
        required: true
    },
    areaPlanted: {
        type: Number,
        required: true
    },
    yieldAmount: {
        type: Number,
        required: true
    },
    income: {
        type: Number,
        required: true
    },
    expenses: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

metricSchema.index({ user: 1, date: 1 });

export const Metric = mongoose.model('Metric', metricSchema);
