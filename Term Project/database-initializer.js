const fs = require('fs').promises;
const { MongoClient, ObjectId } = require('mongodb');

async function readVendor(files) {
    try {
        const fileContents = await Promise.all(
            files.map(file => fs.readFile(file, 'utf-8'))
        );

        const vendors = fileContents.map(data => JSON.parse(data));
        console.log('Parsed Data:', vendors);  // Add this line
        return vendors;
    } catch (error) {
        console.error('Error reading the JSON files:', error);
        throw error;
    }
}


async function initDatabase() {
    let mc;
    try {
      
      let gallery = await readVendor(['gallery/gallery.json']);
      mc = new MongoClient('mongodb://127.0.0.1:27017/', { useNewUrlParser: true });
      await mc.connect();
  
      const db = mc.db('termData');
      const cArtworks = db.collection('artworks');
      const cAccounts = db.collection('accounts');
      cArtworks.deleteMany();
      cAccounts.deleteMany();
      gallery = gallery[0];
      for (const artwork of gallery){
        const addedArtwork = {
          _id: new ObjectId(),
          title: artwork.Title,
          artist: artwork.Artist,
          year: artwork.Year,
          category: artwork.Category,
          medium: artwork.Medium,
          description: artwork.Description,
          poster: artwork.Poster,
          reviews: [],
          likes: 0,
        };
        await cArtworks.insertOne(addedArtwork);
      }
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'Corrine Hunt', 
        password: '',
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []

      });
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'Luke', 
        password: '',
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []

      });
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'Anatoliy Kushch', 
        password: '',
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []

      });
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'Lea Roche', 
        password: '',
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []

      });
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'Jim Dine', 
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []

      });
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'Shari Hatt', 
        password: '',
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []

      });
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'Sebation McKinnon', 
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []

      });
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'Kimika Hara', 
        password: '',
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []

      });
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'Keith Mallett', 
        password: '',
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []

      });
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'ArtMind', 
        password: '',
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []

      });
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'Vincent Van Gogh', 
        password: '',
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []

      });
      await cAccounts.insertOne({
        _id: new ObjectId(), 
        username: 'Banksy', 
        password: '',
        followed: [], 
        reviewed: [], 
        liked: [], 
        workshops: [], 
        notifications: [],
        enrolled: []
      });
      console.log('Database initialized properly!');
    } catch (error) {
      console.error('[ERROR] Could not initialize Database: ', error);
      throw error;
    } finally {
      if (mc) {
        mc.close();
        }
    }
}

initDatabase();