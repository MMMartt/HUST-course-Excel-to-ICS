import { SheetCurriculum } from '../src/curriculum'

export const curriculumGenerator = (): SheetCurriculum => {
  return {
    sheetInfo: {
      collage: '软件学院',
      firstWeekStartAt: new Date(Date.parse('2020-08-31')),
      rawTitle: '软件学院课表啦啦啦啦.xlsx',
      semester: 1,
      startYear: 2020,
    },
    gradeCurriculums: [
      {
        courseInfo: [
          {
            name: 'V101',
            credit: 3,
            classHour: '40*D',
            teacher: 'ling ling',
          },
          {
            name: 'P101',
            credit: 4,
            classHour: '31A',
            teacher: 'lang lang',
          },
        ],
        gradeInfo: {
          department: '软件工程',
          rawTitle: 'r',
          grade: '18软工',
        },
        classCurriculums: [
          {
            classInfo: {
              name: '1801-1804',
              studentNum: 80,
            },
            curriculums: [
              {
                day: 'Tue',
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: {
                  start: 3,
                  end: 10,
                },
                timeArrange: {
                  start: 3,
                  end: 4,
                },
              },
              {
                day: 'Mon',
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: {
                  start: 1,
                  end: 12,
                },
                timeArrange: {
                  start: 1,
                  end: 2,
                },
              },
              {
                day: 'Thu',
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: {
                  start: 1,
                  end: 13,
                },
                timeArrange: {
                  start: 1,
                  end: 4,
                },
              },
              {
                day: 'Wed',
                info: 'LANG LANG WORKOUT',
                location: 'HELL',
                title: 'P101',
                weeks: {
                  start: 1,
                  end: 13,
                },
                timeArrange: {
                  start: 1,
                  end: 4,
                },
              },
              {
                day: 'Fri',
                info: 'LANG LANG F WORKOUT',
                location: 'HELL B401',
                title: 'P101',
                weeks: {
                  start: 3,
                  end: 10,
                },
                timeArrange: {
                  start: 1,
                  end: 8,
                },
              },
              {
                day: 'Mon',
                info: 'LANG LANG WORKOUT',
                location: 'HELL A302',
                title: 'P101',
                weeks: {
                  start: 1,
                  end: 13,
                },
                timeArrange: {
                  start: 5,
                  end: 8,
                },
              },
            ],
          },
          {
            classInfo: {
              name: '1805-1809',
              studentNum: 90,
            },
            curriculums: [
              {
                day: 'Tue',
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: {
                  start: 3,
                  end: 10,
                },
                timeArrange: {
                  start: 1,
                  end: 2,
                },
              },
              {
                day: 'Mon',
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: {
                  start: 1,
                  end: 12,
                },
                timeArrange: {
                  start: 1,
                  end: 2,
                },
              },
              {
                day: 'Thu',
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: {
                  start: 1,
                  end: 13,
                },
                timeArrange: {
                  start: 1,
                  end: 4,
                },
              },
              {
                day: 'Wed',
                info: 'LANG LANG WORKOUT',
                location: 'HELL',
                title: 'P101',
                weeks: {
                  start: 1,
                  end: 13,
                },
                timeArrange: {
                  start: 1,
                  end: 4,
                },
              },
              {
                day: 'Fri',
                info: 'LANG LANG F WORKOUT',
                location: 'HELL B401',
                title: 'P101',
                weeks: {
                  start: 3,
                  end: 10,
                },
                timeArrange: {
                  start: 1,
                  end: 8,
                },
              },
              {
                day: 'Mon',
                info: 'LANG LANG WORKOUT',
                location: 'HELL A302',
                title: 'P101',
                weeks: {
                  start: 1,
                  end: 13,
                },
                timeArrange: {
                  start: 5,
                  end: 8,
                },
              },
            ],
          },
        ],
      },
    ],
  }
}
