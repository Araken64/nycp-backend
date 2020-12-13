import { Schema, Document, model } from 'mongoose';

export enum TypeDecision {
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
  motiveLabel: { type: String, maxlength: 50 },
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
}

export interface Prevention extends Decision{
  type: TypeDecision.PRE;
}

export interface Incarceration extends Decision{
  type: TypeDecision.INC;
}

export interface Sentence extends Decision {
  type: TypeDecision.SEN;
  duration: number;
}

export interface FinalDischarge extends Decision{
  type: TypeDecision.FIN;
  dateOfFinalDischarge: Date;
}

export interface SentenceReduction extends Decision{
  type: TypeDecision.RED;
  duration: number;
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
