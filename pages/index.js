// import {useEffect, useState} from "react"

import MeetupList from "../components/meetups/MeetupList";
import Head from "next/head";
import { MongoClient } from "mongodb";
import { Fragment } from "react";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "First meetup",
//     image:
//       "https://www.trafalgar.com/real-word/wp-content/uploads/sites/3/2016/03/Manarola_iStock_Freeartist_www.istockphoto-1024x682.jpg",
//     address: "Some address 5, 12345 , some city",
//     description: "This is our first meetup",
//   },
//   {
//     id: "m2",
//     title: "Second meetup",
//     image:
//       "https://www.trafalgar.com/real-word/wp-content/uploads/sites/3/2016/03/Manarola_iStock_Freeartist_www.istockphoto-1024x682.jpg",
//     address: "Some address 2, 8fese2 , some city",
//     description: "This is our second meetup",
//   },
//   {
//     id: "m3",
//     title: "Third meetup",
//     image:
//       "https://www.trafalgar.com/real-word/wp-content/uploads/sites/3/2016/03/Manarola_iStock_Freeartist_www.istockphoto-1024x682.jpg",
//     address: "Some new address  135, 4252 , some city",
//     description: "This is our third meetup",
//   },
// ];

function HomePage(props) {
  // state

  // const [loadedMeetups, setLoadedMeetups] = useState([])

  // // effect
  // useEffect(() => {

  //   // fetch data from backend simulating data fetch from server

  //   setLoadedMeetups(DUMMY_MEETUPS);

  // }, [])
  return (
    <Fragment>
      <Head>
        <title>My Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active love meetups"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// this export works only in page component file
// page is faster when working on getStaticProps because the page can be cached and reused.
export async function getStaticProps() {
  // it will call this function, instead of using the component snapshot initially. this function runs before your component function
  // it prepares props for the component. nextjs will wait for this promise to resolve, before the the component function is executed
  // the code in here will never execute in  the client. this code is executed during the build process. this code will never execute on client computer.
  // this function will fetch document from a file system.
  //you always need to return an object in this funciton.

  const client = await MongoClient.connect(
    "mongodb+srv://deba:clemento@cluster0.jgx8k.mongodb.net/meetupsdb?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  let meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })), // SET PROPS FOR THE PAGE COMPONENT
      //incremental static generation
    },
    revalidate: 1, // this page will be generated every couple of seconds on the server. our data will never be older than 10 seconds. so that we don't have to rebuild all the time
  };
}

// export async function getServerSideProps(context){// this is a reserve name. this function will now not run during build  process but always on the server after deployment
//   // we will return an object with the props property. we can fetch data from api or file  sysatem. the code in here will run in the server. we can perform operations that use credentials in here.
// // THIS FUNCTION RUNS FOR  EVERY INCOMING REQUEST
// // the context parameter has accesss to response and request from the  backend

// const {req,res} =  context;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   }

// }

export default HomePage;
