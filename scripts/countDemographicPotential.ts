import { Gender, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
function generatePrismaWhere() {
  const filters: {
    id: string;
    where: {
      gender: Gender;
      interestedIn: Gender;
      birthDate: {
        gte: Date;
        lt: Date;
      };
    };
  }[] = [];
  const genders = [Gender.MALE, Gender.FEMALE, Gender.OTHER];
  const interestedIn = [Gender.MALE, Gender.FEMALE, Gender.OTHER];

  const ages = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
  const birthYearDecades = [
    "1960-1969",
    "1970-1979",
    "1980-1989",
    "1990-1999",
    "2000-2009",
    "2010-2019",
  ] as const;

  for (const gender of genders) {
    for (const interested of interestedIn) {
      for (const birthYearDecade of birthYearDecades) {
        const [start, end] = birthYearDecade.split("-");
        const id = `${gender}->${interested},${birthYearDecade}`;

        filters.push({
          id,
          where: {
            gender,
            interestedIn: interested,
            birthDate: {
              gte: new Date(`${start}-01-01`),
              lt: new Date(`${end}-12-31`),
            },
          },
        });
      }
    }
  }

  return filters;
}

async function main() {
  const filters = generatePrismaWhere();
  for (const filter of filters) {
    const res = await prisma.tinderProfile.count({
      where: filter.where,
    });

    console.log("Filter: ", filter.id, "Count: ", res);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
