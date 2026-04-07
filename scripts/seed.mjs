import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://adeel_db_user:9WmkRdsje4jLKskP@cluster0.3jmrtyx.mongodb.net/RangeBookingAppDB";

const companySchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true },
    primary_contact_name: { type: String },
    primary_contact_email: { type: String },
    primary_contact_phone: { type: String },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: false },
    user_type: { type: String, enum: ["Internal", "External"], default: "External" },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    user_name: { type: String, required: false },
    password: { type: String, required: false },
    role: { type: String, default: "member" },
    status: { type: String, default: "inactive" },
  },
  { timestamps: true }
);

const Company = mongoose.models.Company || mongoose.model("Company", companySchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

const firstNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Adeel", "Sarah", "Jane", "Alex", "Sam", "Chris"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Jabbar", "Doe"];
const companyNames = ["Tech Solutions", "Global Media", "Future Innovations", "Apex Dynamics", "Quantum Network", "Pinnacle Group", "Horizon Ventures", "Nexus Corp", "Orbit Systems", "Stellar Designs", "Vanguard Holdings", "Zenith LLC"];
const statuses = ["active", "inactive", "suspended"];

function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    console.log("Seeding 50 Companies...");
    const companies = [];
    for (let i = 1; i <= 50; i++) {
      const c = new Company({
        company_name: `${rnd(companyNames)} ${i}`,
        primary_contact_name: `${rnd(firstNames)} ${rnd(lastNames)}`,
        primary_contact_email: `contact${i}@example.com`,
        primary_contact_phone: `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        is_active: Math.random() > 0.2, // 80% active
      });
      await c.save();
      companies.push(c);
    }
    console.log(`Created ${companies.length} companies.`);

    console.log("Seeding 50 Users...");
    let createdUsers = 0;
    for (let i = 1; i <= 50; i++) {
        const isInternal = Math.random() > 0.5; // 50-50 internal vs external
        const fName = rnd(firstNames);
        const lName = rnd(lastNames);
        
        const company = isInternal ? null : rnd(companies);
        
        await User.create({
            first_name: fName,
            last_name: lName,
            email: `user${i}_${fName.toLowerCase()}@example.com`,
            user_name: `${fName.toLowerCase()}${i}`,
            phone: `+1-555-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
            user_type: isInternal ? "Internal" : "External",
            company_id: isInternal ? undefined : company?._id,
            status: rnd(statuses),
            role: "member"
        });
        createdUsers++;
    }
    console.log(`Created ${createdUsers} users.`);

    console.log("Done seeding dummy data.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding dummy data:", error);
    process.exit(1);
  }
}

seed();
