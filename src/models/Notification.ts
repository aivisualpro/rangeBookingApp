/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document } from "mongoose";

export type NotificationType = "registration" | "company" | "booking" | "system";

export interface INotification extends Document {
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  link?: string;
  created_at: Date;
}

const NotificationSchema = new Schema(
  {
    type: { type: String, enum: ["registration", "company", "booking", "system"], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

NotificationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, any>) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
