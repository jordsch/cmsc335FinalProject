const http = require('http');
const fs = require("fs");
const path = require("path");
const express = require("express");   /* Accessing express module */
const app = express();  /* app is a request handler function */
const bodyParser = require("body-parser");
const nodeFetch = require("node-fetch");
/* directory where templates will reside */
require("dotenv").config({ path: path.resolve(__dirname, '.env') })  

app.use(express.static(path.join(__dirname, 'contents')));
/* directory where templates will reside */
app.set("views", path.resolve(__dirname, "pages"));

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const dbName = process.env.MONGO_DB_NAME;
const collectionName = process.env.MONGO_COLLECTION;
const delay = ms => new Promise(res => setTimeout(res, ms));
const databaseAndCollection = {db: dbName, collection: collectionName};

/* view/templating engine */
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));

process.stdin.setEncoding("utf8");

// Checking if the correct amount of arguments are provided
if (process.argv.length != 2) {
    process.stdout.write(`Usage node dogClicker.js`);
    process.exit(1);
}

const portNumber = process.argv[2];

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${userName}:${password}@cluster0.fpxkshn.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection

    } catch (e) {
        console.error(e);
    }
  }

run().catch(console.dir);

async function findUser(username) {
    try {
        let filter = {username: username};
        const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).findOne(filter);
        if(result) {
            return result;
        } else {
            return {username: "NONE",
                    password: "NONE",
                    pets: 0,
                    pet_click_amount: 1,
                    per_sec_pets: 0};
        }
    } catch (e) {
        console.error(e.json());
    }
}

async function addUser(user) {
    try {
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(user);
    } catch (e) {
        console.error(e);
    }
}

async function updateUser(username, newValues) {
    try {
        let filter = {username: username};
        let update = { $set: newValues };
        const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).updateOne(filter, update);
        console.log(`Documents modified: ${result}`);
    } catch (e) {
        console.error(e);
    }
}
let port = process.env.PORT || 5000

//Hosting on the provided port number
app.listen(port);
console.log(`Web server started and running at Port ${port}`);

let pets = 0;
let pet_click_amount = 1;
let per_sec_pets = 0;
let dog_src = "image1.png";
let err = "";

idGlobal = setInterval(add, 1000);

async function add() {
    pets += per_sec_pets;

    // Application makes use of some API( the api I am using is from dog.ceo)
    try {
        let resp = await nodeFetch('https://dog.ceo/api/breeds/image/random');
        let jsonData = await resp.json();
        dog_src = jsonData['message'];
    } catch(error) {
        console.log(error);
    }
}

async function message() {
    await delay(5000);
    err = "";
}

app.get("/", (request, response) => {
    const variables = {
        dog_img: '<img src="' + dog_src +'"alt="Dog" id ="thing_to_click">',
        pet_amount: '<p>Amount of pets: ' + pets + '</p>' + '<p>Pets per second: ' + per_sec_pets + '</p>' + '</p>' + '<p>Pets per click: ' + pet_click_amount + '</p>' +  '<p>' + err + '</p>'
    };
    response.render("main_page",variables);
});

app.get("/click", (request, response) => {
    pets += pet_click_amount;
    const variables = {
        dog_img: '<img src="' + dog_src +'"alt="Dog" id ="thing_to_click">',
        pet_amount: '<p>Amount of pets: ' + pets + '</p>' + '<p>Pets per second: ' + per_sec_pets + '</p>' + '</p>' + '<p>Pets per click: ' + pet_click_amount + '</p>' +  '<p>' + err + '</p>'
    };
    response.render("main_page",variables);
});

app.get("/upgrade1", (request, response) => {
    if(pets > 10) {
        pet_click_amount += 1;
        pets -= 10;
    }
    const variables = {
        dog_img: '<img src="' + dog_src +'"alt="Dog" id ="thing_to_click">',
        pet_amount: '<p>Amount of pets: ' + pets + '</p>' + '<p>Pets per second: ' + per_sec_pets + '</p>' + '</p>' + '<p>Pets per click: ' + pet_click_amount + '</p>' +  '<p>' + err + '</p>'
    };
    response.render("main_page",variables);
});

app.get("/upgrade2", (request, response) => {
    if(pets > 100) {
        pet_click_amount += 5;
        pets -= 100;
    }
    const variables = {
        dog_img: '<img src="' + dog_src +'"alt="Dog" id ="thing_to_click">',
        pet_amount: '<p>Amount of pets: ' + pets + '</p>' + '<p>Pets per second: ' + per_sec_pets + '</p>' + '</p>' + '<p>Pets per click: ' + pet_click_amount + '</p>' +  '<p>' + err + '</p>'
    };
    response.render("main_page",variables);
});

app.get("/upgrade3", (request, response) => {
    if(pets > 1000) {
        per_sec_pets += 1;
        pets -= 1000;
    }
    const variables = {
        dog_img: '<img src="' + dog_src +'"alt="Dog" id ="thing_to_click">',
        pet_amount: '<p>Amount of pets: ' + pets + '</p>' + '<p>Pets per second: ' + per_sec_pets + '</p>' + '</p>' + '<p>Pets per click: ' + pet_click_amount + '</p>' +  '<p>' + err + '</p>'
    };
    response.render("main_page",variables);
});

app.get("/upgrade4", (request, response) => {
    if(pets > 10000) {
        per_sec_pets += 10;
        pets -= 10000;
    }
    const variables = {
        dog_img: '<img src="' + dog_src +'"alt="Dog" id ="thing_to_click">',
        pet_amount: '<p>Amount of pets: ' + pets + '</p>' + '<p>Pets per second: ' + per_sec_pets + '</p>' + '</p>' + '<p>Pets per click: ' + pet_click_amount + '</p>' +  '<p>' + err + '</p>'
    };
    response.render("main_page",variables);
});

app.get("/upgrade5", (request, response) => {
    if(pets > 100000) {
        per_sec_pets += 100;
        pet_click_amount += 50;
        pets -= 100000;
    }
    const variables = {
        dog_img: '<img src="' + dog_src +'"alt="Dog" id ="thing_to_click">',
        pet_amount: '<p>Amount of pets: ' + pets + '</p>' + '<p>Pets per second: ' + per_sec_pets + '</p>' + '</p>' + '<p>Pets per click: ' + pet_click_amount + '</p>' +  '<p>' + err + '</p>'
    };
    response.render("main_page",variables);
});

app.post("/login", (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    if(username.localeCompare("NONE") != 0){
        let userQuery = findUser(username)
        userQuery.then((userQuery) => {
            if(userQuery.username.localeCompare("NONE") == 0) {
                err = 'NO USER WITH THAT USERNAME FOUND';
                message()
            } else if(userQuery.password.localeCompare(password) == 0) {
                pets = userQuery.pets;
                pet_click_amount = userQuery.pet_click_amount;
                per_sec_pets = userQuery.per_sec_pets;
                err = 'LOADED DATA';
                message()
            } else {
                err = 'INVALID PASSWORD';
                message()
            }
        });
    } else {
        err = 'INVALID USERNAME';
        message()
    }
    const variables = {
        dog_img: '<img src="' + dog_src +'"alt="Dog" id ="thing_to_click">',
        pet_amount: '<p>Amount of pets: ' + pets + '</p>' + '<p>Pets per second: ' + per_sec_pets + '</p>' + '</p>' + '<p>Pets per click: ' + pet_click_amount + '</p>' +  '<p>' + err + '</p>'
    };
    response.render("main_page",variables);
});

app.post("/save", (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    let user = {
        username: username,
        password: password,
        pets: pets,
        pet_click_amount: pet_click_amount,
        per_sec_pets: per_sec_pets
    };
    if(username.localeCompare("NONE") != 0){
        let userQuery = findUser(user.username)
        userQuery.then((userQuery) => {
            if(userQuery.username.localeCompare("NONE") == 0) {
                addUser(user);
                err = 'NEW USER SAVED';
                message()
            } else if((userQuery.password).localeCompare(user.password) == 0) {
                let newValues = {pets: pets,
                    pet_click_amount: pet_click_amount,
                    per_sec_pets: per_sec_pets};
                updateUser(username,newValues);
                err = 'USER SAVED';
                message()
            } else {
                err = 'INVALID PASSWORD';
                message()
            }
        });
    } else {
        err = 'INVALID USERNAME';
        message()
    }

    const variables = {
        dog_img: '<img src="' + dog_src +'"alt="Dog" id ="thing_to_click">',
        pet_amount: '<p>Amount of pets: ' + pets + '</p>' + '<p>Pets per second: ' + per_sec_pets + '</p>' + '</p>' + '<p>Pets per click: ' + pet_click_amount + '</p>' +  '<p>' + err + '</p>'
    };
    response.render("main_page",variables);
});



const prompt ="Stop to shutdown the server:";
process.stdout.write(prompt);
process.stdin.on("readable", function () {
    let dataInput = process.stdin.read();
    if (dataInput !== null) {
        let command = dataInput.trim();
        if (command === "stop") {
            process.stdout.write("Shutting down the server");
            client.close();
            process.exit(0);
        } else {
            process.stdout.write("Invalid command: " + command + "\n"); 
        }
        process.stdout.write(prompt);
        process.stdin.resume();
    }
});