const express = require('express');
const app = express();
const session = require('express-session')
const PORT = 3000;
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/js', express.static(path.join(__dirname, '/js')));
app.use('/img', express.static(path.join(__dirname, '/img')));
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(express.static('public'));
let db;
let cArtworks;
let acc = "DNE";

app.set('view engine', 'pug');


app.use(session({
  secret: "secretkeyryushen12345678",
  saveUninitialized: true,
  cookie: {username: undefined,
          login: false,
          artist: false
},
  resave: false
}));


app.get('/search', async function (req, res){
  res.render('pages/search')
});


app.get('/find', async function (req, res) {
  try {
    let query = {};
    if (req.query.filter && req.query.type){
      query[req.query.type] = {"$regex": req.query.filter, '$options': 'i'};
    }
    let result = await cArtworks.find(query).toArray();
      res.status(200).json(result);
  } catch (error) {
    console.error('Search failed:', error.message);
    res.status(500).send('Search failed');
  }
});


app.get('/', async function (req, res) {
  try {
    res.render('pages/index');
  } catch (error){
    console.error('Error getting home page: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/workshop', async function (req, res){
  try{
    res.render('pages/workshop');
  } catch (error){
    console.error('Error getting Add Workshop page: ', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/artworks', async function (req, res) {
    try {
      const artworks = await cArtworks.find().toArray();
      res.render('pages/artworks', { artworks });
    } catch (error) {
      console.error('Error getting page:', error);
      res.status(500).send('Internal Server Error');
    }
});


app.get('/register', async function (req, res){
  logged = req.session.login;
  if (await cAccounts.countDocuments() <= 0){
    acc = "DNE";
    res.render("pages/register", { acc });
  }
  else if(logged){
    const user = await cAccounts.findOne({ username: req.session.username });
    res.redirect(`/account`);
  }
  else{
    acc = "exists"
    
    res.render('pages/register', { acc, logged });
  }
});

app.get('/account', async function (req, res) {
  if (!req.session.login){
    return res.status(403).send("Forbidden :D");
  }
  try {
    const username = req.session.username;
    const user = await cAccounts.findOne({ username: username });
    if (!user) {
      res.status(404).send("ID DNE in database");
      return;
    }
    const participants = await cAccounts.find({ enrolled: username }).toArray();
    const reviewedArtworkReviews = user.reviewed;
    const likedArtworkIDs = user.liked.map(id => new ObjectId(id));
    const userArtworks = await cArtworks.find({ artist: username }).toArray();
    const reviews = user.reviewed;
    const notifications = user.notifications;
    const reviewedArtworks = await cArtworks.find({ reviews: { $in: reviewedArtworkReviews } }).toArray();
    const likedArtworks = await cArtworks.find({ _id: { $in: likedArtworkIDs } }).toArray();
    let arty = req.session.artist;
    res.render("pages/account", { user, reviewed: reviewedArtworks, liked: likedArtworks, userArtworks, arty, reviews, notifications, participants});
  } catch (error) {
    console.log('Error finding the user or artworks: ', error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/accounts/:username', async function (req, res){
  try{
    const username = req.params.username;
    const user = await cAccounts.findOne({ username: username });
    if (!user) {
      res.status(404).send("ID DNE in database");
      return;
    }
    const reviews = user.reviewed;
    console.log(username);
    const work = await cAccounts.findOne({ username: username });
    const workshops = work.workshops;
    const userArtworks = await cArtworks.find({ artist: username }).toArray();
    res.render("pages/accounts", {userArtworks, username, workshops, reviews})
  } catch (error){
    console.log('Error finding the user or artworks: ', error);
    res.status(500).send('Internal Server Error')
  }
})


app.get('/addart', async function (req, res){
  try {
    res.render('pages/addart');
  } catch (error){
    console.log('Error getting page', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/artworks/:itemID', async function (req, res){
    let id = req.params.itemID;
    let oid = new ObjectId(id);
    let item = await db.collection("artworks").findOne({ "_id": oid });
    if (!item){
        res.status(404).send("ID DNE in database");
        return;
    }
    try {
        
        console.log(id);
        cArtworks
        .findOne({ "_id": oid})
        .then(result =>{
            if (!result){
            res.status(404).send("ID DNE in database");
            return;
            }
            console.log(result);
            res.render("pages/artwork", {art: result});
        })
    } catch (error){
        console.log('Error finding the item: ', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/workshops', async (req, res) => {
  try {
    const { name } = req.body;
    const username = req.session.username;
    const user = await cAccounts.findOne({ username });
    const message = `${username} added a workshop`;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // console.log(name);
    const result = await cAccounts.findOneAndUpdate(
      { _id: user._id },
      { $push: { workshops: name } },
      { new: true }
    );
    await cAccounts.updateMany(
      { followed: username },
      { $push: { notifications:  message  } }
    );
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(201).json({ message: 'Workshop Added' });
  } catch (error) {
    console.log('Error updating account: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/artworks', async (req, res) => {
  let arty = req.session.artist;
  const { title, year, category, medium, description, poster } = req.body;
  const username = req.session.username;
  const message = `${username} added an artwork`;
  const user = await cAccounts.findOne({ username });
  const userID = await user._id;
  
  if (!category || !title || !year || !medium || !poster || !description) {
    return res.status(400).json({ error: '[ERROR] Please fill out all fields' });
  }

  const exists = await cArtworks.findOne({ title });
  if (exists) {
    return res.status(400).json({ error: "Artwork Title already Exists" });
  }

  let newArtwork = {
    _id: new ObjectId(),
    title: title,
    artist: username,
    year: year,
    category: category,
    medium: medium,
    description: description,
    poster: poster,
    reviews: [],
    likes: 0
  };

  await db.collection("artworks").insertOne(newArtwork);
  req.session.artist = true;
  res.status(201).json({ newArtwork, userID });  

  await cAccounts.updateMany(
    { followed: username },
    { $push: { notifications:  message  } }
  );

});


app.post('/registers', async (req, res) => {
  try {
    const { username, password } = req.body;
    const exists = await cAccounts.findOne({ username });

    if (exists) {
      return res.status(400).json({ error: 'User already exists' });
    } else {
      const result = await cAccounts.insertOne({
        _id: new ObjectId(),
        username,
        password,
        followed: [],
        reviewed: [],
        liked: [],
        workshops: [],
        notifications: [],
        enrolled: []
      });

      const userID = result.insertedId;
      req.session.login = true;
      req.session.username = username;
      console.log("Registered!");
      return res.status(201).json({ message: 'registered', userID });
    }
  } catch (error) {
    console.log('Error Signing up', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/swap', async (req, res) => {
  try {
    req.session.artist = false;
    let arty = req.session.artist;
    return res.status(201).json({ message: 'swapped', arty });
  } catch (error) {
    console.log("Error swapping to patron");
    res.status(500).send('Internal Server Error');
  }
});

app.put('/logout', async (req, res) => {
  try {
    req.session.login = false;
    let logged = req.session.login;
    return res.status(201).json({ message: 'LOGGED OUT', logged });
  } catch (error) {
    console.log("Error swapping to patron");
    res.status(500).send('Internal Server Error');
  }
});

app.put('/logged', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await cAccounts.findOne({ username, password });
    if (user) {
      req.session.login = true;
      req.session.username = username;

      const userID = user._id;

      console.log('signed in');
      return res.status(201).json({ message: 'signed in', userID });
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.log('Error Signing in', error);
    res.status(500).send('Internal Server Error');
  }
});


app.put('/follow', async (req, res) => {
  try {
    const username = req.body.username;
    console.log(req.body);
    const sessionUser = req.session.username;
    if (username == sessionUser){
      return res.status(400).json({ error: 'Cannot follow yourself'})
    }
    const result = await cAccounts.findOneAndUpdate(
      { username: sessionUser },
      { $push: { followed: username } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(201).json({ message: 'Followed' });
  } catch (error) {
    console.log('Error updating account: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/enroll', async (req, res) => {
  try {
    const username = req.body.username;
    console.log(req.body);
    const sessionUser = req.session.username;
    if (req.session.login){
      if (username == sessionUser){
        return res.status(400).json({ error: 'Cannot join your own workshop'})
      }
    }

    const result = await cAccounts.findOneAndUpdate(
      { username: sessionUser },
      { $push: { enrolled: username } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(201).json({ message: 'Followed' });
  } catch (error) {
    console.log('Error updating account: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/unfollow', async (req, res)=>{
  try{
    const user = req.session.username;
    const follower = req.body.follower;
    console.log("Unfollowing", follower);
    let result = await cAccounts.findOneAndUpdate({ username: user },
      { $pull: { followed: follower }}
    );
    if (!result){
      return res.status(404).json({ error: 'User not found'});
    }
    return res.status(204).json({message: 'unfollowed'})
  }catch (error){
    console.log('Error updating account: ', error);
    return res.status(500).json({error: 'Internal Server Error'});
  }
});

app.delete('/unlike', async (req, res) => {
  try {
    const user = req.session.username;
    const artwork = req.body.artwork;
    const art = await cArtworks.findOne({ title: artwork });
    const artID = art._id.toString();
    console.log("Removing like", artwork);

    const resultAccount = await cAccounts.findOneAndUpdate(
      { username: user },
      { $pull: { liked: artID } }
    );
    const resultAccountAfter = await cAccounts.findOne({ username: user });
    console.log('Liked array after update:', resultAccountAfter.liked);

    const resultArtwork = await cArtworks.findOneAndUpdate(
      { title: artwork },
      { $inc: { likes: -1 } }
    );

    if (!resultAccount) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!resultArtwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    res.status(200).json({ message: 'Unlike successful' });

  } catch (error) {
    console.log('Error removing like: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/unreview', async (req, res) => {
  try {
    const user = req.session.username;
    const review = req.body.review;
    console.log("Removing Review", review);

    const resultAccount = await cAccounts.findOneAndUpdate(
      { username: user },
      { $pull: { reviewed: review } }
    );
    const resultAccountAfter = await cAccounts.findOne({ username: user });
    console.log('Review array after update:', resultAccountAfter.reviewed);

    const resultArtwork = await cArtworks.findOneAndUpdate(
      { reviews: review },
      { $pull: { reviews: review } }
    );

    if (!resultAccount) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!resultArtwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    res.status(200).json({ message: 'Review successful' });
  } catch (error) {
    console.log('Error removing review: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/addlike', async (req, res) => {
  try {
      const artID = req.body.itemID;
      const username = req.session.username;
      const ID = { _id: new ObjectId(artID) };
      const artist = await cArtworks.findOne(ID);
      const user = await cAccounts.findOne({ username });
      console.log("this is the artist", artist.artist);
      if (req.session.artist) {
          if (username == artist.artist) {
              return res.status(400).json({ error: 'Cannot like your own artwork' });
          }
      }
      if (!req.session.login) {
          return res.status(400).json({ error: 'not logged in!' });
      }

      const result = await cArtworks.updateOne(ID, { $inc: { likes: 1 } });

      if (result.modifiedCount > 0) {
          const update = await cAccounts.updateOne(
              { _id: new ObjectId(user._id) },
              { $push: { liked: artID } }
          );
          console.log(user);
          return res.status(201).json({ message: 'Like Applied' });
      } else {
          return res.status(500).json({ error: 'Failed to update items' });
      }
  } catch (error) {
      console.log('Error updating items: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/addreview', async (req, res) => {
  try {
    const username = req.session.username;
    const user = await cAccounts.findOne({ username });
    const artID = req.body.itemID;
    const ID = { _id: new ObjectId(artID) };
    const artist = await cArtworks.findOne(ID);
    const review = req.body.review;
    if (req.session.artist){
      if (username == artist.artist){
        return res.status(400).json({ error: 'Cannot review your own artwork'})
      }
    }
    if (!req.session.login){
      return res.status(400).json({ error: 'not logged in!' });
    }
    result = await cArtworks.updateOne(ID, { $push: { reviews: review } });

    if (result.modifiedCount > 0) {

      await cAccounts.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { reviewed: review } },
      );

      console.log(user);
      return res.status(201).json({ message: 'Review Added' });
    } else {
      return res.status(500).json({ error: 'Failed to update items' });
    }
  } catch (error) {
    console.log('Error updating items: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


MongoClient.connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true })
	.then(client => {

		db = client.db("termData");
        cArtworks = db.collection('artworks');
        cAccounts = db.collection('accounts');
		app.listen(3000);
		console.log(`Connected to http://localhost:${PORT}`);
        
	})
	.catch(err => {
		console.log("Error connecting to database");
		console.log(err);
});