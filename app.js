import puppeteer from 'puppeteer'
import nodemailer from 'nodemailer'
import { password } from './secrets.js';
import { email } from './secrets.js';

  
const allAnnouncements = []

async function fetch () {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();

    await page.goto('http://mech.ihu.gr/')

    const dates = await page.$eval('.vc_pageable-slide-wrapper.vc_clearfix', (el) => {
        return Array.from(el.querySelectorAll('div.vc_custom_heading.date_announcements.vc_gitem-post-data.vc_gitem-post-data-source-post_date')).map(el => el.textContent)
    })

    const titles = await page.$eval('.vc_pageable-slide-wrapper.vc_clearfix', (el) => {
        return Array.from(el.querySelectorAll('.vc_custom_heading.vc_gitem-post-data.vc_gitem-post-data-source-post_title')).map(el => el.textContent)
    })

    const links = await page.$$('div.vc_custom_heading.vc_gitem-post-data.vc_gitem-post-data-source-post_title')

    //fetching links for each announcement.
    const linksArr = []
    for (const link of links) {
        const l = await page.evaluate(element => element.querySelector('a').href, link)
        linksArr.push(l)
    }

    //create announcement objects with their unique content and then adding them to the "allAnnouncements" array.
    for (let i=0; i<titles.length; i++) {
        const announcement = {date: dates[i], title: titles[i], link: linksArr[i], content: ''}
        allAnnouncements.push(announcement)
    }
    await browser.close();
};

function formatDate(date, month , year) {
    const d = {date, month, year}
    switch(month) {
        case(1):
            d.month = 'Ιανουαρίου'
            break;
        case(2):
            d.month = 'Φεβρουαρίου'
            break;
        case(3):
            d.month = 'Μαρτίου'
            break;
        case(4):
            d.month = 'Απριλίου'
            break;
        case(5):
            d.month = 'Μαΐου'
            break;
        case(6):
            d.month = 'Ιουνίου'
            break;
        case(7):
            d.month = 'Ιουλίου'
            break;
        case(8):
            d.month = 'Αυγούστου'
            break;
        case(9):
            d.month = 'Σεπτεμβρίου'
            break;
        case(10):
            d.month = 'Οκτωβρίου'
            break;
        case(11):
            d.month = 'Νοεμβρίου'
            break;
        case(12):
            d.month = 'Δεκεμβρίου'
            break;
    }
    return `${d.date} ${d.month} ${d.year}`
}

function findLatestAnnouncements () {
    let latestAnnouncements = []
    let date = new Date().getDate()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    const currentDate = formatDate(date, month, year)

    //find the latest announcement comparing the "currentDate" and the announcement date.
    for (let ann of allAnnouncements) {
        if (ann.date == currentDate) {
            latestAnnouncements.push(ann)
        }
    }
    return latestAnnouncements
}

async function fetchAnnouncementData (ann) {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage()
    await page.goto(ann.link)

    //select post with any post-(number) ending.
    const annBody = await page.$('.post.type-post.status-publish.format-standard.hentry.category-student-announcements > p') 
                ||  await page.$('.post.type-post.status-publish.format-standard.hentry.category-student-announcements > pre')
                ||  'Announcement Body is Empty of is not Found!'

    //fetches text of the article of each announcement.
    if (annBody == 'Announcement Body is Empty of is not Found!') {
        ann.content = annBody
    }
    else if (annBody) {
        const body = await page.evaluate((element) => element.textContent, annBody);
        ann.content = body
    }
    else {
        console.log('Element not found'); // Log a message if the element is not found
    }    
    await browser.close()
}

fetch()
.then(async () => {
    //find latest announcements for a given date. In this case is the current date.
    const latest = findLatestAnnouncements()
    for (let lat of latest) {
        
        //fetches body content for each latest announcement.
        await fetchAnnouncementData(lat)
        .then(() => {
            //then for each announcement, an email is send to a receiver.
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: email,
                  pass: password
                }
                
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
