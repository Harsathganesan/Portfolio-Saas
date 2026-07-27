import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
      required: true,
    },
    senderName: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
    },
    senderEmail: {
      type: String,
      required: [true, 'Sender email is required'],
      trim: true,
    },
    subject: {
      type: String,
      default: 'Inquiry from portfolio contact form',
    },
    message: {
      type: String,
      required: [true, 'Message body is required'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;
