import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import User from "@/models/User";

// 22 Digital Competencies as per Test_School framework
const competencies = [
  "Information and Data Literacy",
  "Communication and Collaboration",
  "Digital Content Creation",
  "Safety and Security",
  "Problem Solving",
  "Technical Skills",
  "Media Literacy",
  "Ethics and Legal Issues",
  "Critical Thinking",
  "Creativity and Innovation",
  "E-Learning Skills",
  "Digital Identity Management",
  "Digital Marketing",
  "Digital Research",
  "Digital Project Management",
  "Digital Analytics",
  "Digital Accessibility",
  "Digital Business Skills",
  "Digital Leadership",
  "Digital Citizenship",
  "Programming and Coding",
  "Digital Design and UX",
];

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

// Generate questions for each competency and level
const generateQuestions = (): any[] => {
  const questions: any[] = [];

  competencies.forEach((competency, compIndex) => {
    levels.forEach((level, levelIndex) => {
      // Create 2 questions per competency-level combination for variety
      for (let i = 0; i < 2; i++) {
        const difficulty =
          levelIndex < 2 ? "easy" : levelIndex < 4 ? "medium" : "hard";
        const step = levelIndex < 2 ? 1 : levelIndex < 4 ? 2 : 3;

        questions.push({
          competency,
          level,
          step,
          question: generateQuestionText(competency, level, i + 1),
          options: generateOptions(competency, level),
          correctAnswer: 0, // First option is always correct for consistency
          explanation: `This question tests ${level} level understanding of ${competency.toLowerCase()}.`,
          difficulty,
          category: competency,
          timeLimit: 60, // 1 minute per question
        });
      }
    });
  });

  return questions;
};

const generateQuestionText = (
  competency: string,
  level: string,
  questionNum: number
): string => {
  const questionTemplates = {
    "Information and Data Literacy": {
      A1: [
        `What is the primary purpose of a search engine?`,
        `Which file format is commonly used for documents?`,
      ],
      A2: [
        `How can you verify the reliability of online information?`,
        `What should you check before downloading a file?`,
      ],
      B1: [
        `Explain the difference between data and information in digital contexts.`,
        `How would you organize digital files effectively?`,
      ],
      B2: [
        `What are the key principles of data management in organizations?`,
        `How do you evaluate the credibility of digital sources?`,
      ],
      C1: [
        `Analyze the impact of big data on decision-making processes.`,
        `Design a data governance framework for an organization.`,
      ],
      C2: [
        `Evaluate advanced data analytics techniques for business intelligence.`,
        `Create a comprehensive data strategy for digital transformation.`,
      ],
    },
    "Communication and Collaboration": {
      A1: [
        `What is email used for?`,
        `Name a popular video calling application.`,
      ],
      A2: [
        `How do you share files safely online?`,
        `What are the basic features of collaborative tools?`,
      ],
      B1: [
        `Compare different digital communication platforms and their uses.`,
        `How would you manage online team collaboration?`,
      ],
      B2: [
        `What are the best practices for virtual team management?`,
        `How do you handle conflicts in digital communications?`,
      ],
      C1: [
        `Design a comprehensive digital communication strategy for an organization.`,
        `Analyze the effectiveness of various collaboration tools.`,
      ],
      C2: [
        `Develop an enterprise-level collaboration framework.`,
        `Evaluate the impact of digital communication on organizational culture.`,
      ],
    },
    // Add more competencies with similar structure...
  };

  const competencyQuestions =
    questionTemplates[competency as keyof typeof questionTemplates];
  if (
    competencyQuestions &&
    competencyQuestions[level as keyof typeof competencyQuestions]
  ) {
    const questions =
      competencyQuestions[level as keyof typeof competencyQuestions];
    return (
      questions[questionNum - 1] ||
      `${level} level question about ${competency.toLowerCase()}.`
    );
  }

  return `${level} level question about ${competency.toLowerCase()}: Question ${questionNum}`;
};

const generateOptions = (competency: string, level: string): string[] => {
  // Generate contextually appropriate options based on competency and level
  const baseOptions = [
    "Correct answer for this competency",
    "Incorrect option A",
    "Incorrect option B",
    "Incorrect option C",
  ];

  // Customize options based on competency
  switch (competency) {
    case "Information and Data Literacy":
      return [
        "To find and retrieve information from the internet",
        "To create websites and web pages",
        "To send emails and messages",
        "To store files on computer",
      ];
    case "Communication and Collaboration":
      return [
        "To facilitate interaction and teamwork",
        "To create digital content only",
        "To manage files and folders",
        "To analyze data and statistics",
      ];
    case "Technical Skills":
      return [
        "Understanding of hardware and software",
        "Only knowledge of social media",
        "Basic reading and writing skills",
        "Mathematical calculations only",
      ];
    default:
      return baseOptions;
  }
};

export async function seedComprehensiveQuestions() {
  try {
    await connectDB();

    // Find or create admin user
    let adminUser = await User.findOne({ email: "admin@testschool.com" });
    if (!adminUser) {
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 12);

      adminUser = new User({
        firstName: "System",
        lastName: "Admin",
        email: "admin@testschool.com",
        password: hashedPassword,
        role: "admin",
        isEmailVerified: true,
      });
      await adminUser.save();
    }

    // Clear existing questions
    await Question.deleteMany({});

    // Generate comprehensive question set
    const allQuestions = generateQuestions();

    // Add createdBy field to each question
    const questionsWithCreator = allQuestions.map((q) => ({
      ...q,
      createdBy: adminUser._id,
    }));

    // Insert questions in batches to avoid memory issues
    const batchSize = 50;
    let totalInserted = 0;

    for (let i = 0; i < questionsWithCreator.length; i += batchSize) {
      const batch = questionsWithCreator.slice(i, i + batchSize);
      await Question.insertMany(batch);
      totalInserted += batch.length;
      console.log(
        `Inserted batch: ${totalInserted}/${questionsWithCreator.length} questions`
      );
    }

    // Verify question distribution
    const summary = await Question.aggregate([
      {
        $group: {
          _id: { competency: "$competency", level: "$level", step: "$step" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.step",
          competencies: { $sum: 1 },
          totalQuestions: { $sum: "$count" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("Question distribution by step:", summary);
    console.log(
      `Successfully seeded ${totalInserted} questions across ${competencies.length} competencies and ${levels.length} levels`
    );

    return {
      success: true,
      count: totalInserted,
      competencies: competencies.length,
      levels: levels.length,
      distribution: summary,
    };
  } catch (error) {
    console.error("Error seeding comprehensive questions:", error);
    throw error;
  }
}
