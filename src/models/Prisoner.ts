import { Schema, Document, model } from 'mongoose';

const prisonerSchema: Schema = new Schema({
  prisonFileNumber: {
    type: String, maxlength: 10, index: true, unique: true, required: true,
  },
  givenName: { type: String, maxlength: 30 },
  surname: { type: String, maxlength: 30 },
  dateOfBirth: { type: Date, max: Date.now() },
  placeOfBirth: { type: String, maxlength: 30 },
  dateOfIncaceration: { type: Date },
  motiveLabel: { type: String, maxlength: 50, required: true },
  juridictionName: { type: String, maxlength: 30, required: true },
  criminalCase: { type: [String], maxlength: 10 },
  decision:
  {
    type: [
      {
        type: {
          type: String, enum: ['prevention', 'incarceration', 'sentence', 'final_discharge', 'sentence_reduction'], required: true,
        },
        dateOfDecision: { type: Date },
        duration: { type: Number, min: 0 },
        dateOfFinalDischarge: { type: Date },
      },
    ],
  },
});

export interface Decision extends Document {
  type: string;
  dateOfDecision: Date;
  duration: number;
  dateOfFinalDischarge: Date;
}

export interface Prisoner extends Document {
  prisonFileNumber: string;
  givenName?: string;
  surname?: string;
  dateOfBirth?: Date;
  placeOfBirth?: Date;
  dateOfIncarceration?: Date;
  motiveLabel: string;
  juridictionName: string;
  criminalCase?: Array<string>;
  decision?: Array<Decision>;
}

export default model<Prisoner>('PrisonerModel', prisonerSchema);
