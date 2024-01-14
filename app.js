const fetch = require('./fetchAnn.js')
const findLatestAnnouncements =  require('./findLatestAnn.js')
const fetchAnnouncementData  =  require('./fetchAnnData.js')
const sendEmail =  require('./sendEmail.js')
const { checkIfAnnouncementsExistInDB, saveAnnouncementToDB } = require('./db.js')


//create a log system to not send the same announcements every time.

const searchForAnnouncements = async () => {
    await fetch()
    .then(async () => {
        //find latest announcements for a given date. In this case is the current date.
        const latest = findLatestAnnouncements()
        
        //check if latest announcements are found
        if (latest.length != 0) {

            //check if announcements are already sent.
            let announcements_exist = checkIfAnnouncementsExistInDB(latest)
            if (announcements_exist === true) {
                console.log('Announcements Exist in Database and therefore already sent!')
                return
            } else {
                //if not fetch the announcements body text and for each one send an email.
                for (let lat of latest) {
                    //fetches body content for each latest announcement.
                    await fetchAnnouncementData(lat)
                    .then(async () => {
                        //then for each announcement, an email is send to a receiver.
                        //await sendEmail(lat)
                        console.log('latest')
                        console.log(latest)
                        await saveAnnouncementToDB(lat)
                    })
                }
<<<<<<< HEAD
            }
        }
        else {
            console.log('no new announcements found.')
        }
    })
}

searchForAnnouncements()
=======
                
            });
            const mailOptions = {
                from: email,
                to: '[email list]',
                subject: lat.title,
                text: lat.content
            };
            transporter.sendMail(mailOptions)
            .then(res => {
                console.log(res)
            })
            .catch(e => console.log('Something went wrong ' + e))
        })
    }
})
>>>>>>> 383033f92767f7f379dc3977e81857250280df86
