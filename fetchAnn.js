const puppeteer = require('puppeteer')
let allAnnouncements = require('./classes/AllAnnouncements')
const Announcement = require('./classes/Announcement')

module.exports = async function fetch () {
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
        const announcement = new Announcement(dates[i], titles[i], linksArr[i], '')
        allAnnouncements.addAnnouncement(announcement)
    }
    await browser.close();
};