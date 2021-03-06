/* eslint-disable no-unused-vars */
const fs = require("fs");
const path = require("path");
const got = require("got");
const kristianTinderData = require("./data.json");
const extractAnonymizedTinderData = require("../utils/extractAnonymizedTinderData");

const companies = ["McKinsey", "BCG", "Netlight", "Bekk"];
const title = ["Developer", "Product Manager", "Consultant"];
const schools = ["NTNU", "UiO", "MIT", "Stanford"];
const locations = [
  { name: "New York", region: "USA" },
  { name: "Oslo", region: "Norway" },
  { name: "Trondheim", region: "Norway" },
  { name: "Boston", region: "USA" },
  { name: "Stockholm", region: "Sweden" }
];

function getRandomElementFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getFilteredTimeLine(startDate, endDate, objectWithDateKeys) {
  return Object.entries(objectWithDateKeys).filter(
    ([key, val]) => key > startDate && key < endDate
  );
}

function createRandomUser(baseData, index) {
  const location = getRandomElementFromArray(locations);
  const gender = Math.random() < 0.5 ? "M" : "F";
  const interestedIn =
    gender === "M"
      ? Math.random() > 0.3
        ? "F"
        : "M"
      : Math.random() > 0.3
      ? "M"
      : "F";

  const createDate = `${Math.floor(
    Math.random() * 3 + 2014
  )}-01-01T09:30:07.551Z`;

  const startDate = createDate.substring(0, 10);
  const endDate = `${Math.floor(Math.random() * 2 + 2017)}-01-01`;

  return {
    ...baseData,
    User: {
      ...baseData.User,
      create_date: createDate,
      email: `user+${index}@email.com`,
      birth_date: `${Math.floor(
        Math.random() * 25 + 1975
      )}-01-01T00:00:00.000Z`,
      gender,
      gender_filter: interestedIn,
      interested_in: interestedIn,
      jobs: [
        {
          company: {
            displayed: Math.random < 0.5,
            name: getRandomElementFromArray(companies)
          },
          title: {
            displayed: Math.random < 0.5,
            name: getRandomElementFromArray(title)
          }
        }
      ],
      schools: [
        {
          displayed: Math.random < 0.5,
          name: getRandomElementFromArray(schools)
        }
      ],
      city: {
        name: location.name,
        region: location.region
      }
    },
    Usage: {
      ...baseData.Usage,
      matches: getFilteredTimeLine(
        startDate,
        endDate,
        baseData.Usage.matches
      ).reduce((acc, [key, val]) => {
        return {
          ...acc,
          [key]: Math.floor(Math.random() * 15)
        };
      }, {}),
      app_opens: getFilteredTimeLine(
        startDate,
        endDate,
        baseData.Usage.app_opens
      ).reduce((acc, [key, val]) => {
        return {
          ...acc,
          [key]: Math.floor(Math.random() * 30)
        };
      }, {}),
      messages_sent: getFilteredTimeLine(
        startDate,
        endDate,
        baseData.Usage.messages_sent
      ).reduce((acc, [key, val]) => {
        return {
          ...acc,
          [key]: Math.floor(Math.random() * 15)
        };
      }, {}),
      messages_received: getFilteredTimeLine(
        startDate,
        endDate,
        baseData.Usage.messages_received
      ).reduce((acc, [key, val]) => {
        return {
          ...acc,
          [key]: Math.floor(Math.random() * 15)
        };
      }, {}),
      swipes_likes: getFilteredTimeLine(
        startDate,
        endDate,
        baseData.Usage.swipes_likes
      ).reduce((acc, [key, val]) => {
        return {
          ...acc,
          [key]: Math.floor(Math.random() * 100)
        };
      }, {}),
      swipes_passes: getFilteredTimeLine(
        startDate,
        endDate,
        baseData.Usage.swipes_passes
      ).reduce((acc, [key, val]) => {
        return {
          ...acc,
          [key]: Math.floor(Math.random() * 100)
        };
      }, {})
    },
    Messages: baseData.Messages.slice(Math.floor(Math.random() * 500)).map(
      ({ match_id, messages }) => ({
        match_id,
        messages: messages.map(({ message, ...messageMeta }) => messageMeta)
      })
    )
  };
}

async function create500Users() {
  for (let index = 0; index < 500; index++) {
    const user = createRandomUser(kristianTinderData, index);

    const swipeStatsData = extractAnonymizedTinderData(user);

    const res = await got.post("http://localhost:3000/api/uploadData", {
      json: swipeStatsData
    });

    console.log("res ok?", res.ok);
  }
}

create500Users();

// read file

// for 500 times

// createNewTinderData
// 50% boy girl
// unique email
// matches 0 - 30
// appOpens 0 - 50
// messages sent 0-30
// messages received 0-30
// swipes likes 0-200
// swipes passes 0-200
// Messages
