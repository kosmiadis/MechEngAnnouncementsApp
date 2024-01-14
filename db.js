const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = require('./secrets').uri

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

const checkIfAnnouncementsExistInDB = async (anns) => {
    //initialing variable false so that if announcements are found 
    //it changes to true, else if are not found it will stay false,
    //meaning it didn't found the announcements
    let announcementsAlreadyExist = false
    try {
        await client.connect();
        const database = client.db('MECH_ENG_APP')
        const all_announcements_coll = database.collection('all_announcements')
        
        //Checking if anns are already stored in database. In this case the announcements have already been sent.
        //So there is no need for sending them again.
        for (let ann of anns) {
            let found = await all_announcements_coll.findOne({title: ann.title})
            if (found) {
                announcementsAlreadyExist = true
                break;
            }
        }
    } finally {
        await client.close();
    }
    return announcementsAlreadyExist 
}

const saveAnnouncementToDB = async (ann) => {
    try {
        await client.connect();
        const database = client.db('MECH_ENG_APP')
        const all_announcements_coll = database.collection('all_announcements')
        
        //Checking if anns are already stored in database. In this case the announcements have already been sent.
        //So there is no need for sending them again.
        await all_announcements_coll.insertOne(ann)
    } finally {
        await client.close();
    }
}

module.exports = {
    checkIfAnnouncementsExistInDB, 
    saveAnnouncementToDB
}

