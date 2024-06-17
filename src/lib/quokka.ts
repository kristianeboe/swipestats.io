export type DateKeyString = string; //`${number}-${number}-${number}`;

export type DateValueMap = Record<DateKeyString, number>;

const appOpens: DateValueMap = {
  "2022-01-15": 0,
  "2022-01-16": 0,
  "2022-01-17": 0,
  "2022-01-18": 1,
  "2022-01-19": 0,
  "2022-01-20": 0,
  "2022-01-21": 0,
  "2022-01-22": 0,
  "2022-01-23": 0,
  "2022-01-24": 0,
  "2022-01-25": 0,
  "2022-01-26": 0,
  "2022-01-27": 0,
  "2022-01-28": 0,
  "2022-01-29": 0,
  "2022-01-30": 0,
  "2022-01-31": 0,
  "2022-02-01": 0,
  "2022-02-02": 0,
  "2022-02-03": 0,
  "2022-02-04": 0,
  "2022-02-05": 0,
  "2022-02-06": 0,
  "2022-02-07": 0,
  "2022-02-08": 0,
  "2022-02-09": 0,
  "2022-02-10": 1,
  "2022-02-11": 1,
  "2022-02-12": 1,
  "2022-02-13": 1,
  "2022-02-14": 1,
  "2022-02-15": 1,
};

function wasActiveInPeriod(
  dateKey: string,
  dateValueMap: DateValueMap,
  range = 5, // how many days before to check for activity
): boolean {
  const targetDate = new Date(dateKey);

  for (let i = -range; i <= 0; i++) {
    // Check preceding dates and the current date
    const date = new Date(targetDate);
    date.setDate(date.getDate() + i);
    const currentKey = date.toISOString().split("T")[0]!;
    const dateValue = dateValueMap[currentKey];
    if (dateValue !== undefined && dateValue > 0) {
      return true;
    }
  }

  return false;
}

function consideredActiveUser(
  dateKey: string,
  dateValueMap: DateValueMap,
  range = 5, // how many days before to check for activity
): boolean {
  const targetDate = new Date(dateKey);
  if (dateValueMap[dateKey] && dateValueMap[dateKey]! > 0) {
    return true;
  }

  for (let i = -range; i < 0; i++) {
    // Check preceding dates and the current date
    const date = new Date(targetDate);
    date.setDate(date.getDate() + i);
    const currentKey = date.toISOString().split("T")[0]!;
    const dateValue = dateValueMap[currentKey];
    if (dateValue !== undefined && dateValue > 0) {
      return true;
    }
  }

  return false;
}

console.log(consideredActiveUser("2022-02-09", appOpens, 5));
