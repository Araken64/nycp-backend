import { Schema, Document, model } from 'mongoose';

enum TypeDecision {
  PRE = 'prevention',
  INC = 'incarceration',
  SEN = 'sentence',
  FIN = 'final_discharge',
  RED = 'sentence_reduction',
}

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
          type: String,
          enum: [
            TypeDecision.PRE, TypeDecision.INC, TypeDecision.SEN,
            TypeDecision.FIN, TypeDecision.RED,
          ],
          required: true,
        },
        dateOfDecision: { type: Date },
        duration: { type: Number, min: 0 },
        dateOfFinalDischarge: { type: Date },
      },
    ],
  },
});

export interface Decision {
  type: TypeDecision;
  dateOfDecision: Date;
  duration?: number;
  dateOfFinalDischarge?: Date;
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
  criminalCase: Array<string>;
  decision: Array<Decision>;
}

export default model<Prisoner>('PrisonerModel', prisonerSchema);
