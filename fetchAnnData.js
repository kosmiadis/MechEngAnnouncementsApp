const puppeteer = require('puppeteer')

module.exports = async function fetchAnnouncementData (ann) {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage()
    await page.goto(ann.link)

    //select post with any post-(number) ending.
    const annBody = await page.$('.post.type-post.status-publish.format-standard.hentry.category-student-announcements > p') 
                ||  await page.$('.post.type-post.status-publish.format-standard.hentry.category-student-announcements > pre')
                ||  'Announcement Body is Empty or is not Found!'

    //fetches text of the article of each announcement.
    if (annBody == 'Announcement Body is Empty or is not Found!') {
        ann.body = annBody
    }
    else if (annBody) {
        const body = await page.evaluate((element) => element.textContent, annBody);
        ann.body = body
    }
    else {
        console.log('Element not found'); // Log a message if the element is not found
    }    
    await browser.close()
}