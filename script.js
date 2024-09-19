// The provided course information.
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
    const assignment = ag.assignments.find((assignment) => assignment.id == id); // == because it's a string compared with number
    if (!assignment) {
      throw "Invalid assignment ID";
    }
    return assignment;
  }
  const learnerData = [];
  try {
    if (course.id !== ag.course_id) {
      throw "Invalid course information";
    }
    submissions.forEach((submission) => {
      const assignment = findAssignmentById(submission.assignment_id);
      let score = submission.submission.score;
      if (typeof score !== "number") {
        throw "Invalid score";
      }
      // deduct points for late submission
      if (submission.submission.submitted_at > assignment.due_at) {
        score *= 0.9;
      }
      // find learner by id
      let learner = learnerData.find(
        (item) => item.id === submission.learner_id
      );
      // if not found, create new learner
      if (!learner) {
        learner = {
          id: submission.learner_id,
        };
        learnerData.push(learner);
      }
      // do not log if assignment is not due yet
      if (assignment.due_at > new Date().toISOString()) {
        return;
      }
      if (assignment.points_possible === 0) {
        learner[submission.assignment_id] = 0;
        return;
      }
      learner[submission.assignment_id] = score / assignment.points_possible;
    });
    learnerData.forEach((learner) => {
      let total = 0;
      let numberOfAssignments = 0;
      Object.keys(learner).forEach((key) => {
        if (key !== "id") {
          numberOfAssignments++;
          total += learner[key];
        }
      });
      learner.avg = total / numberOfAssignments;
    });
  } catch (e) {
    console.error(e);
  }
  return learnerData;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
