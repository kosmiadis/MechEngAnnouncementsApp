const formatDate = require('./formatDate')
const allAnnouncements = require('./classes/AllAnnouncements')

module.exports = function findLatestAnnouncements () {
    let latestAnnouncements = []
    let date = new Date().getDate()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    const currentDate = formatDate(date, month, year)

    //find the latest announcement comparing the "currentDate" and the announcement date.
    for (let ann of allAnnouncements.all_announcements) {
        
        if (ann.date == '12 Ιανουαρίου 2024') {
            latestAnnouncements.push(ann)    
        }
    }
    return latestAnnouncements
}
