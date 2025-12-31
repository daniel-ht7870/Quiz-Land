# Quizland

This web-based application allows users to create accounts and take fun quizzes created by other users. At the end of a quiz, the application makes predictions based on the user responses (e.g. "Are you a dog person or a cat person?" quiz).

Currently, there are # pages:

* The __Login/Sign Up Page__ allows users to create and log into existing accounts. The account authentication services are hosted by Firebase Authentication.
* The __Main Page__ is the next destination following user authentication. On this page, users can browse an assortment of quizzes to take, or navigate to another page.
* The __Quiz Page__ is reached when a user decides to take a quiz, there they will be able to submit their responses and, eventually, view their predictions.
* The __Edit Page__ allows users to view quizzes they have created in the past and either modify or delete them.
* And finally, the __Quiz Builder Page__ allows users to modify their quizzes by adding results, questions, and question responses. This is also where users assign weights to their quiz question's responses with accordance to the results that they have added.

A demonstration showcasing the usage of _Quizland_ and a short tutorial can be found [here](https://youtu.be/ELRiAmxP8tk).

# Building the project

_Quizland_ uses __NPM__ to manage dependencies and run a local server. To install all package requirements run the following command in the project directory:

```
npm install
```

Following _npm install_, run the following command to launch your local server in development mode:

```
npm run dev
```

From there, you should see a link in your terminal of choice to the local port hosting _Quizland_. It should look something like this:

```
> quiz-land@0.0.0 dev
> vite


  VITE v7.2.6  ready in 263 ms

  ➜  Local:   http://localhost:5173/Quiz-Land/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

__NOTE:__ _Quizland's_ backend services (the database and the user authentication system) are provided by _Firebase_, as such, in order to successfully run _Quizland_ on your device, you must create your own _FirebaseConfig.jsx_ file in the project's _src_ directory and export a _firebaseConfig_ variable containing your _Firebase_ configuration information. The format of the file should look like the following:

```
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGE_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

export { firebaseConfig };
```

This file's contents should be easily generatable by _Firebase_: you need to navigate to your _Firebase_ console, then go to your project settings, scroll down to _Your apps_ (you might need to create a new web app for your project), choose _npm_ for the _SDK setup and configuration_, and in the generated codeblock you should be able to view the _firebaseConfig_ variable that needs to be implemented in the _.jsx_ file to run _Quizland_.
