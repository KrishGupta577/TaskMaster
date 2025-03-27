import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    index: {
      type: Number,
    },
  },
  { timestamps: true }
);

// 🏗 Automatically assign index before saving
TaskSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastTask = await mongoose.model('Task').findOne({ userId: this.userId }).sort('-index');
    this.index = lastTask ? lastTask.index + 1 : 0; // If no tasks, start at 0
  }
  next();
});

const TaskModel = mongoose.models.Task || mongoose.model('Task', TaskSchema);
export default TaskModel;
