import { Schema, Document, model } from 'mongoose';

const criminalCaseSchema: Schema = new Schema({
  criminalCaseNumber: {
    type: String, required: true, index: true, unique: true, maxlength: 10,
  },
  juridictionName: { type: String, maxlength: 30 },
  dateOfCriminalCase: { type: Date, max: Date.now },
  prisoner: { type: [String], maxlength: 10 },
});

export interface CriminalCase extends Document {
  criminalCaseNumber: string;
  juridictionName?: string;
  dateOfCriminalCase?: Date;
  prisoner: Array<string>;
}

export default model<CriminalCase>('CriminalCaseModel', criminalCaseSchema);
