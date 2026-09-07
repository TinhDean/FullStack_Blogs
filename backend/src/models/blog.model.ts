import mongoose, { Schema, Document } from 'mongoose';

export interface BlogDocument extends Document {
  title: string;
  content: string;
  category: string;
  thumbnail?: string;
  author?: mongoose.Types.ObjectId;
  views: number;
  likes: number;
  isDeleted: boolean;
}

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    category: {
      type: String,
      default: "Chưa phân loại"
    },
    thumbnail: {
      type: String,
      default: '',
      validate: {
        validator: function (v: string) {
          if (!v || v.trim() === '') return true;
          return /^https?:\/\/.+/i.test(v.trim());
        },
        message: 'Thumbnail URL phải bắt đầu bằng http:// hoặc https://'
      }
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

BlogSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    try {
      await mongoose.model('Comment').deleteMany({ blogId: doc._id });
      console.log(`[Cascading Delete] Removed comments for blog ID: ${doc._id}`);
    } catch (error) {
      console.error('[Cascading Delete Error]', error);
    }
  }
});

export default mongoose.model<BlogDocument>('Blog', BlogSchema);
