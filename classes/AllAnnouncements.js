class AllAnnouncements {
    constructor() {
        this.all_announcements = []
    }

    addAnnouncement(announcement) {
        this.all_announcements.push(announcement);
    }
}
const allAnnouncements = new AllAnnouncements()
module.exports = allAnnouncements
