import * as Mongoose from 'mongoose';

const criminalCaseSchema: Mongoose.Schema = new Mongoose.Schema({
  criminalCaseNumber: { type: String, required: true },
});

export default Mongoose.model('CriminalCase', criminalCaseSchema);
