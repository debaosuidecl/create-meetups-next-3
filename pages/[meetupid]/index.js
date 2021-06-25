import MeetupDetails from "../../components/meetups/MeetupDetails";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";

import Head from "next/head";
function MeetupDetailsPage(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupdata.title}</title>

        <meta name="description" content={props.meetupdata.description}></meta>
      </Head>
      <MeetupDetails
        title={props.meetupdata.title}
        address={props.meetupdata.address}
        description={props.meetupdata.description}
        image={props.meetupdata.image}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  // getStaticPaths help to pre render all dynamic values for the build process for which this will be pregenerated
  const client = await MongoClient.connect(
    "mongodb+srv://deba:clemento@cluster0.jgx8k.mongodb.net/meetupsdb?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection
    .find(
      {},
      {
        _id: 1, // only include id
      }
    )
    .toArray();
  return {
    fallback: false, // if false, paths contains all supported id values. if meetupid is m3,404 error is thrown. if true, next will try to generate a page for the meetupid  dynamically for  the server
    paths: meetups.map((meetup) => ({
      params: {
        meetupid: meetup._id.toString(),
      },
    })),
    // paths: [
    //     {
    //         params: {
    //             meetupid: "m1"
    //         }
    //     },
    //     {
    //         params: {
    //             meetupid: "m2"
    //         }
    //     },
    // ]
  };
}

export async function getStaticProps(context) {
  // it will call this function, instead of using the component snapshot initially. this function runs before your component function
  // it prepares props for the component. nextjs will wait for this promise to resolve, before the the component function is executed
  // the code in here will never execute in  the client. this code is executed during the build process. this code will never execute on client computer.
  // this function will fetch document from a file system.
  //you always need to return an object in this funciton.
  // context  also exists here. context here doesn't have request an response  but it has a params key
  const client = await MongoClient.connect(
    "mongodb+srv://deba:clemento@cluster0.jgx8k.mongodb.net/meetupsdb?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetupid = context.params.meetupid;

  const meetupdata = await meetupsCollection.findOne({
    _id: ObjectId(meetupid),
  });

  console.log(meetupid);

  return {
    props: {
      meetupdata: {
        id: meetupdata._id.toString(),
        title: meetupdata.title,
        address: meetupdata.address,
        image: meetupdata.image,
        description: meetupdata.description,
      },
      //   meetupdata: {
      //     image:
      //     "https://www.trafalgar.com/real-word/wp-content/uploads/sites/3/2016/03/Manarola_iStock_Freeartist_www.istockphoto-1024x682.jpg", // SET PROPS FOR THE PAGE COMPONENT
      //   //incremental static generation
      //   id: meetupid,
      //   title: "First meetup",
      //   address: "some address",
      //   description: "cool meetup",
      //   }
    },
    revalidate: 1, // this page will be generated every couple of seconds on the server. our data will never be older than 10 seconds. so that we don't have to rebuild all the time
  };
}

export default MeetupDetailsPage;
