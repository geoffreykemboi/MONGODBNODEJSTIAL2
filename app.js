const { MongoClient } = require("mongodb");

// Load MongoDB connection URI from an external file
const uri = require("./atlas_uri");

const client = new MongoClient(uri);
const dbname = "bank";
const collection_name = "accounts";

const pipeline = [
  { $match: { balance: { $lt: 1000 } } }, // Filter accounts with balance < 1000
  {
    $group: {
      _id: "$account_type", // Group by account type
      total_balance: { $sum: "$balance" }, // Total balance per account type
      avg_balance: { $avg: "$balance" }, // Average balance per account type
    },
  },
];

const main = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Access the database and collection
    const accountsCollection = client.db(dbname).collection(collection_name);

    // Perform aggregation query
    let result = await accountsCollection.aggregate(pipeline).toArray();

    // Display aggregation results
    console.log("Aggregation Results:");
    result.forEach((doc) => console.log(doc));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
};

// Execute the function
main();
