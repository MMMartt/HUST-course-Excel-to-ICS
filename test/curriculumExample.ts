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
                day: 2,
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: [[3, 10]],
                timeArrange: {
                  start: 3,
                  end: 4,
                },
              },
              {
                day: 1,
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: [[1, 12]],
                timeArrange: {
                  start: 1,
                  end: 2,
                },
              },
              {
                day: 4,
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: [[1, 13]],
                timeArrange: {
                  start: 1,
                  end: 4,
                },
              },
              {
                day: 3,
                info: 'LANG LANG WORKOUT',
                location: 'HELL',
                title: 'P101',
                weeks: [[1, 13]],
                timeArrange: {
                  start: 1,
                  end: 4,
                },
              },
              {
                day: 5,
                info: 'LANG LANG F WORKOUT',
                location: 'HELL B401',
                title: 'P101',
                weeks: [[3, 10]],
                timeArrange: {
                  start: 1,
                  end: 8,
                },
              },
              {
                day: 1,
                info: 'LANG LANG WORKOUT',
                location: 'HELL A302',
                title: 'P101',
                weeks: [[1, 13]],
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
                day: 2,
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: [[3, 10]],
                timeArrange: {
                  start: 1,
                  end: 2,
                },
              },
              {
                day: 1,
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: [[1, 12]],
                timeArrange: {
                  start: 1,
                  end: 2,
                },
              },
              {
                day: 4,
                info: 'LING LING WORKOUT',
                location: 'PARADISE',
                title: 'V101',
                weeks: [[1, 13]],
                timeArrange: {
                  start: 1,
                  end: 4,
                },
              },
              {
                day: 3,
                info: 'LANG LANG WORKOUT',
                location: 'HELL',
                title: 'P101',
                weeks: [[1, 13]],
                timeArrange: {
                  start: 1,
                  end: 4,
                },
              },
              {
                day: 5,
                info: 'LANG LANG F WORKOUT',
                location: 'HELL B401',
                title: 'P101',
                weeks: [[3, 10]],
                timeArrange: {
                  start: 1,
                  end: 8,
                },
              },
              {
                day: 1,
                info: 'LANG LANG WORKOUT',
                location: 'HELL A302',
                title: 'P101',
                weeks: [[1, 13]],
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
