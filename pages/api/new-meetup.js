// this is server side code
import { MongoClient } from "mongodb";
// /api/new-meetup

async function handler(req, res) {
  // only post request
  if (req.method === "POST") {
    const data = req.body;

    const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      "mongodb+srv://deba:clemento@cluster0.jgx8k.mongodb.net/meetupsdb?retryWrites=true&w=majority"
    );
    const db = client.db();

    const meetupsCollection = db.collection("meetups");

    const result = await meetupsCollection.insertOne({
      title,
      image,
      address,
      description,
    });

    console.log(result);

    client.close();

    res.status(201).json({
      message: "Meetups inserted",
    });
  }
}

export default handler;
