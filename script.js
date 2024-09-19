// The provided course information.
const CourseInfo2 = {
  id: 452,
  name: "Introduction to Python",
};
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(course, ag, submissions) {
  function findAssignmentById(id) {
    const assignment = ag.assignments.find((assignment) => assignment.id == id);
    if (!assignment) {
      throw "Invalid assignment ID";
    }
    return assignment;
  }
  const result = [];
  try {
    if (course.id !== ag.course_id) {
      throw "Invalid course information";
    }
    submissions.forEach((submission) => {
      const assignment = findAssignmentById(submission.assignment_id);
      // deduct points for late submission
      if (submission.submission.submitted_at > assignment.due_at) {
        submission.submission.score *= 0.9;
      }
      // find student by id
      let student = result.find((item) => item.id === submission.learner_id);
      if (!student) {
        student = {
          id: submission.learner_id,
        };
        result.push(student);
      }
      student[submission.assignment_id] =
        submission.submission.score / assignment.points_possible;
    });
    result.forEach((student) => {
      let total = 0;
      let numberOfAssignments = 0;
      Object.keys(student).forEach((key) => {
        if (key !== "id") {
          const assignment = findAssignmentById(key);
          // if the assignment is not due, do not log
          if (assignment.due_at > new Date().toISOString()) {
            return;
            // if assignment is late, deduct 10%
          } else if (assignment.due_at < new Date().toISOString()) {
            student[key] *= 0.9;
          }
          numberOfAssignments++;
          total += student[key];
        }
      });
      student.avg = total / numberOfAssignments;
    });
  } catch (e) {
    console.error(e);
  }

  // const result = [
  //   {
  //     id: 125,
  //     avg: 0.985, // (47 + 150) / (50 + 150)
  //     1: 0.94, // 47 / 50
  //     2: 1.0, // 150 / 150
  //   },
  //   {
  //     id: 132,
  //     avg: 0.82, // (39 + 125) / (50 + 150)
  //     1: 0.78, // 39 / 50
  //     2: 0.833, // late: (140 - 15) / 150
  //   },
  // ];

  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
