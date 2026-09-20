export const SNAPSHOT = { updatedDate: '2026-09-20' };

// School snapshot recorded September 20, 2026. This is not a live Canvas feed.
export const COURSES = {
  "algebra": "https://georgiacyber.instructure.com/courses/91459",
  "ela": "https://georgiacyber.instructure.com/courses/90405",
  "science": "https://georgiacyber.instructure.com/courses/90918",
  "ss": "https://georgiacyber.instructure.com/courses/90612",
  "pe": "https://georgiacyber.instructure.com/courses/89891",
  "algebraWeek": "https://georgiacyber.instructure.com/courses/91459/modules/items/7450153",
  "elaWeek": "https://georgiacyber.instructure.com/courses/90405/modules/items/7569402",
  "scienceWeek": "https://georgiacyber.instructure.com/courses/90918/modules/items/7686250",
  "ssWeek": "https://georgiacyber.instructure.com/courses/90612/modules/items/7681178"
};

export const GRADES = [
  {
    "name": "Algebra",
    "pct": 98.46,
    "teacher": "Osborne",
    "url": "https://georgiacyber.instructure.com/courses/91459"
  },
  {
    "name": "ELA 6",
    "pct": 98.75,
    "teacher": "Zeiler",
    "url": "https://georgiacyber.instructure.com/courses/90405"
  },
  {
    "name": "Science 7",
    "pct": 100,
    "teacher": "Norris",
    "url": "https://georgiacyber.instructure.com/courses/90918"
  },
  {
    "name": "SS 6",
    "pct": 100,
    "teacher": "Burnham",
    "url": "https://georgiacyber.instructure.com/courses/90612"
  },
  {
    "name": "PE 6",
    "pct": null,
    "teacher": "Siegel",
    "url": "https://georgiacyber.instructure.com/courses/89891"
  }
];

export const DUE = [
  {
    "id": "due-ss-fair",
    "title": "SS Fair Final",
    "when": "Mon Sep 21 · 11:59 pm",
    "pts": "100 pts",
    "url": "https://georgiacyber.instructure.com/courses/90612/assignments/2168962",
    "dueDate": "2026-09-21",
    "dueAt": "2026-09-21T23:59:00-04:00"
  },
  {
    "id": "due-alg-test",
    "title": "Algebra Unit 3 Test",
    "when": "Thu Sep 24 · 11:59 pm",
    "pts": "100 pts",
    "url": "https://georgiacyber.instructure.com/courses/91459/assignments/2265249",
    "dueDate": "2026-09-24",
    "dueAt": "2026-09-24T23:59:00-04:00"
  },
  {
    "id": "due-ia1-sci",
    "title": "IA1 Science",
    "when": "Tue Sep 29 · 8:00 am",
    "url": "https://georgiacyber.instructure.com/calendar?event_id=3990381&include_contexts=course_90888",
    "dueDate": "2026-09-29",
    "dueAt": "2026-09-29T08:00:00-04:00"
  },
  {
    "id": "due-ia1-ss",
    "title": "IA1 Social Studies",
    "when": "Wed Sep 30 · 8:00 am",
    "url": "https://georgiacyber.instructure.com/calendar?event_id=3990382&include_contexts=course_90888",
    "dueDate": "2026-09-30",
    "dueAt": "2026-09-30T08:00:00-04:00"
  },
  {
    "id": "due-alg-sg",
    "title": "Algebra Unit 3 Study Guide",
    "when": "Wed Sep 30 · 11:59 pm",
    "pts": "100 pts",
    "url": "https://georgiacyber.instructure.com/courses/91459/assignments/2263610",
    "dueDate": "2026-09-30",
    "dueAt": "2026-09-30T23:59:00-04:00"
  },
  {
    "id": "due-ia1-ela",
    "title": "IA1 / Beacon ELA",
    "when": "Thu Oct 1 · 8:00 am",
    "url": "https://georgiacyber.instructure.com/calendar?event_id=3990383&include_contexts=course_90888",
    "dueDate": "2026-10-01",
    "dueAt": "2026-10-01T08:00:00-04:00"
  },
  {
    "id": "due-ela-u2",
    "title": "ELA Unit 2 Test",
    "when": "Thu Oct 1 · 11:59 pm",
    "pts": "100 pts",
    "url": "https://georgiacyber.instructure.com/courses/90405/assignments/2238136",
    "dueDate": "2026-10-01",
    "dueAt": "2026-10-01T23:59:00-04:00"
  }
];

export const WEEK = {
  "2026-09-21": {
    "label": "Mon 21",
    "full": "Monday · Sep 21",
    "items": [
      {
        "id": "t-ss-fair",
        "title": "Submit SS Fair Final",
        "detail": "Due Mon Sep 21 at 11:59 pm",
        "url": "https://georgiacyber.instructure.com/courses/90612/assignments/2168962",
        "due": true,
        "subject": "ss"
      },
      {
        "id": "t-ss-mod",
        "title": "SS Monday modules",
        "detail": "Cold War / Progress Learning",
        "url": "https://georgiacyber.instructure.com/courses/90612/modules/items/7681178",
        "subject": "ss"
      },
      {
        "id": "t-alg-mod",
        "title": "Start Unit 3, Lesson 2",
        "detail": "Unit 3, Lesson 2",
        "url": "https://georgiacyber.instructure.com/courses/91459/modules/items/7450153",
        "subject": "algebra"
      },
      {
        "id": "t-ela-mod",
        "title": "Poetic structure",
        "url": "https://georgiacyber.instructure.com/courses/90405/modules/items/7569402",
        "subject": "ela",
        "detail": "Lesson 1"
      },
      {
        "id": "t-sci-mod",
        "title": "Science Monday IA review",
        "detail": "Includes ungraded module work",
        "url": "https://georgiacyber.instructure.com/courses/90918/modules/items/7686250",
        "subject": "science"
      }
    ]
  },
  "2026-09-22": {
    "label": "Tue 22",
    "full": "Tuesday · Sep 22",
    "items": [
      {
        "id": "t-ss-tue",
        "title": "SS Tuesday modules / unit test",
        "url": "https://georgiacyber.instructure.com/courses/90612/modules/items/7681178",
        "due": true,
        "subject": "ss"
      },
      {
        "id": "t-alg-tue",
        "title": "Algebra — continue Unit 3",
        "url": "https://georgiacyber.instructure.com/courses/91459/modules/items/7450153",
        "subject": "algebra"
      },
      {
        "id": "t-ela-tue",
        "title": "Rhyme scheme",
        "url": "https://georgiacyber.instructure.com/courses/90405/modules/items/7569402",
        "subject": "ela"
      },
      {
        "id": "t-sci-tue",
        "title": "Science Tuesday IA review",
        "url": "https://georgiacyber.instructure.com/courses/90918/modules/items/7686250",
        "subject": "science"
      }
    ]
  },
  "2026-09-23": {
    "label": "Wed 23",
    "full": "Wednesday · Sep 23",
    "items": [
      {
        "id": "t-alg-sg",
        "title": "Algebra Unit 3 Study Guide",
        "url": "https://georgiacyber.instructure.com/courses/91459/assignments/2263610",
        "subject": "algebra",
        "detail": "Prepare for Thursday’s test · Due Sep 30"
      },
      {
        "id": "t-ss-wed",
        "title": "SS Wednesday IA review",
        "url": "https://georgiacyber.instructure.com/courses/90612/modules/items/7681178",
        "subject": "ss"
      },
      {
        "id": "t-ela-wed",
        "title": "Review plot",
        "url": "https://georgiacyber.instructure.com/courses/90405/modules/items/7569402",
        "subject": "ela"
      },
      {
        "id": "t-sci-wed",
        "title": "Science Wednesday IA review",
        "url": "https://georgiacyber.instructure.com/courses/90918/modules/items/7686250",
        "subject": "science"
      }
    ]
  },
  "2026-09-24": {
    "label": "Thu 24",
    "full": "Thursday · Sep 24",
    "items": [
      {
        "id": "t-alg-test",
        "title": "Algebra Unit 3 Test",
        "detail": "Due Thu Sep 24 at 11:59 pm",
        "url": "https://georgiacyber.instructure.com/courses/91459/assignments/2265249",
        "due": true,
        "subject": "algebra"
      },
      {
        "id": "t-ss-thu",
        "title": "SS Thursday IA review",
        "url": "https://georgiacyber.instructure.com/courses/90612/modules/items/7681178",
        "subject": "ss"
      },
      {
        "id": "t-ela-thu",
        "title": "Theme",
        "url": "https://georgiacyber.instructure.com/courses/90405/modules/items/7569402",
        "subject": "ela"
      },
      {
        "id": "t-sci-thu",
        "title": "Science Thursday IA review",
        "url": "https://georgiacyber.instructure.com/courses/90918/modules/items/7686250",
        "subject": "science"
      }
    ]
  },
  "2026-09-25": {
    "label": "Fri 25",
    "full": "Friday · Sep 25",
    "items": [
      {
        "id": "t-ss-fri",
        "title": "SS Friday IA review",
        "url": "https://georgiacyber.instructure.com/courses/90612/modules/items/7681178",
        "subject": "ss"
      },
      {
        "id": "t-ela-fri",
        "title": "Tone and mood",
        "detail": "Lesson 5 · Ungraded module work",
        "url": "https://georgiacyber.instructure.com/courses/90405/modules/items/7569402",
        "subject": "ela"
      },
      {
        "id": "t-catch",
        "title": "Finish any remaining work",
        "url": "https://georgiacyber.instructure.com/",
        "subject": "all",
        "detail": "Review unfinished work in Canvas"
      }
    ]
  }
};
