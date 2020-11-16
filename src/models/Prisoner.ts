import * as Mongoose from 'mongoose';
import CriminalCase from './CriminalCase';

const prisonerSchema: Mongoose.Schema = new Mongoose.Schema({
  prisonFileNumber: {
    type: String, maxlength: 10, index: true, unique: true,
  },
  givenName: { type: String, maxlength: 30 },
  surname: { type: String, maxlength: 30 },
  dateOfBirth: { type: Date, max: Date.now() },
  placeOfBirth: { type: String, maxlength: 30 },
  dateOfIncaceration: { type: Date },
  motiveLabel: { type: String, maxlength: 50, required: true },
  juridictionName: { type: String, maxlength: 30, required: true },
  criminalCase: { type: [CriminalCase], required: true },
  decision:
  {
    type: [
      {
        type: { type: String, maxlength: 1, required: true },
        dateOfDecision: { type: Date },
        duration: { type: Number },
        dateOfFinalDischarge: { type: Date },
      },
    ],
  },
});

export default Mongoose.model('Prisoner', prisonerSchema);
