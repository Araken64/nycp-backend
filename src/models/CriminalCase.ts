import * as Mongoose from 'mongoose';

const criminalCaseSchema: Mongoose.Schema = new Mongoose.Schema({
  criminalCaseNumber: {
    type: String, required: true, index: true, unique: true, maxlength: 10,
  },
  juridictionName: { type: String, maxlength: 30 },
  dateOfCriminalCase: { type: Date, max: Date.now },
  prisoner: [{ type: String, required: true, maxlength: 10 }],
});

export default Mongoose.model('CriminalCase', criminalCaseSchema);
