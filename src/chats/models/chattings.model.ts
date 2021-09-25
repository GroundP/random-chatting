import { IsNotEmpty, IsString } from 'class-validator';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';
import { Socket as SocketModel } from './sockets.model';

const options: SchemaOptions = {
  collection: 'chattings', // 지정하지 않으면 Chatting에서 소문자를 만들고 s를 붙인 이름으로 저장됨
  timestamps: true,
};

@Schema(options)
export class Chatting extends Document {
  @Prop({
    type: {
      _id: { type: Types.ObjectId, required: true, ref: 'sockets' },
      id: { type: String }, // sockets.id
      username: { type: String, required: true }, // sockets.username
    },
  })
  @IsNotEmpty()
  @IsString()
  user: SocketModel;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  chat: string;
}

export const ChattingSchema = SchemaFactory.createForClass(Chatting);
