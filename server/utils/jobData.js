// const jobsData = [
//   { name: "Plumber" },
//   { name: "Electrician" },
//   { name: "Carpenter" },
//   { name: "Painter" },
//   { name: "Mechanic" },
//   { name: "Driver" },
//   { name: "Cleaner" },
//   { name: "Cook" },
//   { name: "Maid" },
//   { name: "Security Guard" },
//   { name: "Welder" },
//   { name: "Construction Worker" },
//   { name: "Tailor" },
//   { name: "Gardener" },
//   { name: "AC Technician" },
//   { name: "Labourer" },
//   { name: "Babysitter" },
//   { name: "Delivery Boy" },
//   { name: "Waiter" },
//   { name: "Chef" },
//   { name: "Barber" },
//   { name: "Washerman" },
//   { name: "Sweeper" },
//   { name: "Watchman" },
//   { name: "Mobile Repair" },
//   { name: "Computer Technician" },
//   { name: "Data Entry Operator" },
//   { name: "Accountant" },
//   { name: "Software Developer" },
//   { name: "Teacher" },
//   { name: "Nurse" },
//   { name: "Doctor" },
//   { name: "Pharmacist" },
//   { name: "Lawyer" },
//   { name: "Photographer" },
//   { name: "Video Editor" },
//   { name: "Graphic Designer" },
//   { name: "Fitness Trainer" },
//   { name: "Housekeeping" },
//   { name: "Beautician" },
//   { name: "Receptionist" },
//   { name: "Storekeeper" },
//   { name: "Event Planner" },
//   { name: "Cleaner (Hotel)" },
//   { name: "Laundry Staff" },
//   { name: "Farm Worker" },
//   { name: "Fisherman" },
//   { name: "Packer" },
//   { name: "Warehouse Helper" },
//   { name: "Office Assistant" },
// ];

// module.exports = jobsData;

// const communityMembers = [
//   {
//     name: "Aarav Sharma",
//     email: "aarav.sharma@gmail.com",
//     parishUser: "6834a14c049ece087d39cfdb",
//     pradheshikam: "683949cbe7889da368fae2b3",
//     unit: "68394fb2b2628b2764f26d6b",
//     community: "6839629d4af49bfe92c21939",
//     owner: "68328e13d3c21fb9abf79e47",
//   },
//   {
//     name: "Diya Nair",
//     email: "diya.nair@gmail.com",
//     parishUser: "6834a14c049ece087d39cfdb",
//     pradheshikam: "683949cbe7889da368fae2b3",
//     unit: "68394fb2b2628b2764f26d6b",
//     community: "6839629d4af49bfe92c21939",
//     owner: "68328e13d3c21fb9abf79e47",
//   },
// ];

// module.exports = communityMembers;

// const pradheshikams = [
//   "Thulavila",
//   "Mariyan Nagar",
//   "Christ Nagar",
//   "Kadaykulam",
//   "Vizhinjam",
//   "Kalluvettan Kuzhi",
//   "Kottappuram",
//   "St.Josheph",
//   "Osavila",
//   "Charuvila",
//   "Karumballikara",
//   "Thennoor Konam",
//   "St,marys",
//   "Karayadivila",
//   "Mukkola 1",
//   "MaUkkola 2",
// ].map((name) => ({
//   pradheshikamName: name,
//   owner: "683949cbe7889da368fae2ac",

//   parishUser: "6834a14c049ece087d39cfdb",

//   images:
//     "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//   parishRepresantive: "no",
// }));

// module.exports = pradheshikams;

///////////////////////////////////////////community create ////////////////////////////////////
// const mongoose = require("mongoose");

// const baseId = new mongoose.Types.ObjectId("683949cbe7889da368fae2aa"); // Starting point

// // module.exports = pradheshikams;
// const education = [
//   { name: "Software Developer", type: "job" },
//   { name: "Data Scientist", type: "job" },
//   { name: "Civil Engineer", type: "job" },
//   { name: "Mechanical Engineer", type: "job" },
//   { name: "Electrical Engineer", type: "job" },
//   { name: "Doctor", type: "job" },
//   { name: "Nurse", type: "job" },
//   { name: "Pharmacist", type: "job" },
//   { name: "Surgeon", type: "job" },
//   { name: "Chartered Accountant", type: "job" },
//   { name: "Financial Analyst", type: "job" },
//   { name: "Auditor", type: "job" },
//   { name: "Teacher", type: "job" },
//   { name: "Professor", type: "job" },
//   { name: "Electrician", type: "job" },
//   { name: "Plumber", type: "job" },
//   { name: "Mechanic", type: "job" },
//   { name: "Driver", type: "job" },
//   { name: "Office Clerk", type: "job" },
//   { name: "Legal Assistant", type: "job" },
//   { name: "Receptionist", type: "job" },
//   { name: "Customer Support", type: "job" },
//   { name: "Sales Executive", type: "job" },
//   { name: "Marketing Manager", type: "job" },
//   { name: "SEO Specialist", type: "job" },
//   { name: "Graphic Designer", type: "job" },
//   { name: "Content Writer", type: "job" },
//   { name: "Video Editor", type: "job" },
//   { name: "Librarian", type: "job" },
//   { name: "Police Officer", type: "job" },
//   { name: "Army Officer", type: "job" },
//   { name: "Bank PO", type: "job" },
//   { name: "Data Entry Operator", type: "job" },
//   { name: "HR Executive", type: "job" },
//   { name: "UX Designer", type: "job" },
//   { name: "Fashion Designer", type: "job" },
//   { name: "Architect", type: "job" },
//   { name: "Journalist", type: "job" },
//   { name: "Photographer", type: "job" },
//   { name: "Business Analyst", type: "job" },
//   { name: "Product Manager", type: "job" },
//   { name: "Web Developer", type: "job" },
//   { name: "AI Engineer", type: "job" },
//   { name: "DevOps Engineer", type: "job" },
//   { name: "Cloud Architect", type: "job" },
//   { name: "Veterinary Doctor", type: "job" },
//   { name: "Farm Manager", type: "job" },
//   { name: "Irrigation Specialist", type: "job" },
//   { name: "Environmental Scientist", type: "job" },
//   { name: "Pre-KG", type: "education" },
//   { name: "LKG", type: "education" },
//   { name: "UKG", type: "education" },
//   { name: "1", type: "education" },
//   { name: "2", type: "education" },
//   { name: "3", type: "education" },
//   { name: "4", type: "education" },
//   { name: "5", type: "education" },
//   { name: "6", type: "education" },
//   { name: "7", type: "education" },
//   { name: "8", type: "education" },
//   { name: "9", type: "education" },
//   { name: "10", type: "education" },
//   { name: "11", type: "education" },
//   { name: "12", type: "education" },
//   { name: "Diploma", type: "education" },
//   { name: "ITI", type: "education" },
//   { name: "Polytechnic", type: "education" },
//   { name: "BA", type: "education" },
//   { name: "BSc", type: "education" },
//   { name: "BCom", type: "education" },
//   { name: "BBA", type: "education" },
//   { name: "BCA", type: "education" },
//   { name: "BE", type: "education" },
//   { name: "BTech", type: "education" },
//   { name: "LLB", type: "education" },
//   { name: "MBBS", type: "education" },
//   { name: "BDS", type: "education" },
//   { name: "BHMS", type: "education" },
//   { name: "BAMS", type: "education" },
//   { name: "BPT", type: "education" },
//   { name: "B.Ed", type: "education" },
//   { name: "MSc", type: "education" },
//   { name: "MA", type: "education" },
//   { name: "MCom", type: "education" },
//   { name: "MBA", type: "education" },
//   { name: "MCA", type: "education" },
//   { name: "MTech", type: "education" },
//   { name: "ME", type: "education" },
//   { name: "MPhil", type: "education" },
//   { name: "PhD", type: "education" },
// ];

// module.exports = education;
//pradhshikam exports
// const mongoose = require("mongoose");

// const pradheshikamNames = [
//   "Thulavila",
//   "Mariyan Nagar",
//   "Christ Nagar",
//   "Kadaykulam",
//   "Vizhinjam",
//   "Kalluvettan Kuzhi",
//   "Kottappuram",
//   "St.Josheph",
//   "Osavila",
//   "Charuvila",
//   "Karumballikara",
//   "Thennoor Konam",
//   "St,marys",
//   "Karayadivila",
//   "Mukkola 1",
//   "MaUkkola 2",
// ];

// // Define a base ObjectId (any valid one to start incrementing from)
// const baseId = new mongoose.Types.ObjectId("64c95f4e0f1f1a0a0a0a0a0a");

// const pradheshikams = pradheshikamNames.map((name, index) => {
//   const idBuffer = Buffer.from(baseId.toHexString(), "hex");
//   idBuffer[11] += index; // Increment one of the bytes to make it unique

//   const newId = new mongoose.Types.ObjectId(idBuffer);

//   return {
//     _id: newId,
//     pradheshikamName: name,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   };
// });

// module.exports = pradheshikams;
/////////////////////////////////////////////////////unit create //////////////////////////////////
// const pradheshikams = [];

// const baseUnitNames = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

// // For pradheshikam 1
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a0a",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });

// // For pradheshikam 2
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a0b",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 3
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a0c",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 5
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a0d",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 5
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a0e",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 6
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a0e",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 7
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a0f",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 7
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a10",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 8
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a11",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 9
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a12",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 10
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a13",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 11
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a14",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 12
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a15",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 13
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a16",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 13
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a17",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 14
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a18",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });
// // For pradheshikam 15
// baseUnitNames.forEach((unitName) => {
//   pradheshikams.push({
//     unitName,
//     owner: "6875c5ec6d5b4e22e2cdbaa4",
//     parishUser: "6875c5ec6d5b4e22e2cdbaa4",
//     pradheshikam: "64c95f4e0f1f1a0a0a0a0a19",
//     images:
//       "https://res.cloudinary.com/dmfaaroor/image/upload/v1748150249/pfuespprqe0yjt5qclzv.jpg",
//     parishRepresantive: "no",
//   });
// });

// module.exports = pradheshikams;
