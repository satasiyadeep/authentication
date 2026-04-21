import bcrypt from 'bcrypt';
const saltRounds = 11;
const myPlaintextPassword = 'deep@.123';
const someOtherPlaintextPassword = 'what is this';
const res1 = await bcrypt.genSalt(saltRounds);
const res2 = await bcrypt.genSaltSync(saltRounds);
const res3 = await bcrypt.hash(myPlaintextPassword, saltRounds);
const res4 = bcrypt.hashSync(myPlaintextPassword, saltRounds);
console.log(res3);
//# sourceMappingURL=test.js.map