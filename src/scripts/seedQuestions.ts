import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import User from "@/models/User";

const sampleQuestions = [
  // Step 1: A1-A2 Level Questions
  {
    competency: "Reading Comprehension",
    level: "A1",
    step: 1,
    question:
      "What is the main idea of this sentence: 'The cat sits on the mat.'?",
    options: [
      "A cat is sleeping",
      "A cat is sitting on a mat",
      "A cat is running",
      "A cat is eating",
    ],
    correctAnswer: 1,
    explanation: "The sentence clearly states that the cat sits on the mat.",
    difficulty: "easy",
    category: "Basic Reading",
  },
  {
    competency: "Grammar",
    level: "A1",
    step: 1,
    question: "Choose the correct form: 'I ___ a student.'",
    options: ["am", "is", "are", "be"],
    correctAnswer: 0,
    explanation: "With 'I', we use 'am' in the present tense.",
    difficulty: "easy",
    category: "Basic Grammar",
  },
  {
    competency: "Vocabulary",
    level: "A1",
    step: 1,
    question: "What does 'hello' mean?",
    options: ["Goodbye", "Thank you", "Greeting", "Sorry"],
    correctAnswer: 2,
    explanation: "'Hello' is a common greeting used when meeting someone.",
    difficulty: "easy",
    category: "Basic Vocabulary",
  },
  {
    competency: "Reading Comprehension",
    level: "A2",
    step: 1,
    question:
      "Read: 'Tom goes to school every day. He likes math and science.' What subjects does Tom like?",
    options: [
      "Math and English",
      "Science and History",
      "Math and Science",
      "English and Science",
    ],
    correctAnswer: 2,
    explanation: "The text clearly states Tom likes math and science.",
    difficulty: "easy",
    category: "Reading Comprehension",
  },
  {
    competency: "Grammar",
    level: "A2",
    step: 1,
    question: "Choose the correct past tense: 'Yesterday, I ___ to the store.'",
    options: ["go", "goes", "went", "going"],
    correctAnswer: 2,
    explanation: "'Went' is the past tense of 'go'.",
    difficulty: "medium",
    category: "Past Tense",
  },

  // Step 2: B1-B2 Level Questions
  {
    competency: "Reading Comprehension",
    level: "B1",
    step: 2,
    question:
      "What is the author's main argument in a text about renewable energy benefits?",
    options: [
      "Renewable energy is expensive",
      "Renewable energy reduces environmental impact",
      "Renewable energy is unreliable",
      "Renewable energy requires government support",
    ],
    correctAnswer: 1,
    explanation:
      "The main argument typically focuses on environmental benefits.",
    difficulty: "medium",
    category: "Intermediate Reading",
  },
  {
    competency: "Grammar",
    level: "B1",
    step: 2,
    question:
      "Choose the correct conditional: 'If I ___ rich, I would travel the world.'",
    options: ["am", "was", "were", "be"],
    correctAnswer: 2,
    explanation:
      "In hypothetical conditionals, we use 'were' with all subjects.",
    difficulty: "medium",
    category: "Conditional Grammar",
  },
  {
    competency: "Writing",
    level: "B1",
    step: 2,
    question:
      "Which sentence shows the best structure for an opinion essay introduction?",
    options: [
      "I think cats are better than dogs because they are independent.",
      "Cats versus dogs is a topic many people discuss.",
      "While both cats and dogs make excellent pets, cats offer unique advantages that make them superior companions.",
      "This essay is about cats and dogs.",
    ],
    correctAnswer: 2,
    explanation:
      "A good introduction presents the topic and thesis clearly with sophisticated language.",
    difficulty: "medium",
    category: "Essay Writing",
  },
  {
    competency: "Reading Comprehension",
    level: "B2",
    step: 2,
    question:
      "What rhetorical device is used in: 'The classroom was a zoo during the substitute teacher's visit'?",
    options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
    correctAnswer: 1,
    explanation:
      "This is a metaphor comparing the classroom to a zoo without using 'like' or 'as'.",
    difficulty: "medium",
    category: "Literary Analysis",
  },
  {
    competency: "Grammar",
    level: "B2",
    step: 2,
    question:
      "Identify the correct passive voice: 'The company will announce the results tomorrow.'",
    options: [
      "The results will announce by the company tomorrow.",
      "The results will be announced by the company tomorrow.",
      "The results will been announced by the company tomorrow.",
      "The results will be announce by the company tomorrow.",
    ],
    correctAnswer: 1,
    explanation: "Passive voice requires 'will be' + past participle.",
    difficulty: "medium",
    category: "Passive Voice",
  },

  // Step 3: C1-C2 Level Questions
  {
    competency: "Critical Analysis",
    level: "C1",
    step: 3,
    question:
      "Analyze the implicit bias in this statement: 'Despite being a woman, she was an excellent leader.' What does this reveal?",
    options: [
      "Women are naturally good leaders",
      "Leadership requires gender-neutral qualities",
      "There's an assumption that women are typically poor leaders",
      "Gender doesn't affect leadership ability",
    ],
    correctAnswer: 2,
    explanation:
      "The phrase 'despite being a woman' implies an expectation that women are not good leaders.",
    difficulty: "hard",
    category: "Critical Thinking",
  },
  {
    competency: "Advanced Grammar",
    level: "C1",
    step: 3,
    question: "Which sentence demonstrates correct use of subjunctive mood?",
    options: [
      "I wish I was taller.",
      "I suggest that he goes to the doctor.",
      "It's important that she be present at the meeting.",
      "If I was you, I would study more.",
    ],
    correctAnswer: 2,
    explanation:
      "The subjunctive mood uses 'be' after 'that' in formal suggestions or requirements.",
    difficulty: "hard",
    category: "Advanced Grammar",
  },
  {
    competency: "Academic Writing",
    level: "C1",
    step: 3,
    question:
      "Which transition best connects these ideas: 'Renewable energy shows promise. ___ initial costs remain prohibitive.'",
    options: ["However", "Therefore", "Furthermore", "Similarly"],
    correctAnswer: 0,
    explanation:
      "'However' shows contrast between the promise and the limitation.",
    difficulty: "hard",
    category: "Academic Writing",
  },
  {
    competency: "Literary Analysis",
    level: "C2",
    step: 3,
    question:
      "What narrative technique is demonstrated in: 'Little did she know that her decision would alter the course of history'?",
    options: [
      "Dramatic irony",
      "Foreshadowing",
      "Stream of consciousness",
      "In medias res",
    ],
    correctAnswer: 1,
    explanation: "This is foreshadowing, hinting at future significant events.",
    difficulty: "hard",
    category: "Advanced Literary Analysis",
  },
  {
    competency: "Philosophy",
    level: "C2",
    step: 3,
    question: "According to Kantian ethics, what makes an action moral?",
    options: [
      "Its consequences produce the greatest good",
      "It follows the categorical imperative",
      "It maximizes personal happiness",
      "It adheres to social conventions",
    ],
    correctAnswer: 1,
    explanation:
      "Kant's deontological ethics focuses on duty and the categorical imperative, not consequences.",
    difficulty: "hard",
    category: "Ethics and Philosophy",
  },
];

export async function seedQuestions() {
  try {
    await connectDB();

    // Find an admin user to assign as creator
    let adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      // Create a default admin user if none exists
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 12);

      adminUser = new User({
        firstName: "System",
        lastName: "Admin",
        name: "System Admin",
        email: "admin@testschool.com",
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });
      await adminUser.save();
    }

    // Clear existing questions
    await Question.deleteMany({});

    // Add createdBy field to each question
    const questionsWithCreator = sampleQuestions.map((q) => ({
      ...q,
      createdBy: adminUser._id,
    }));

    // Insert sample questions
    await Question.insertMany(questionsWithCreator);

    console.log(`Successfully seeded ${questionsWithCreator.length} questions`);
    return { success: true, count: questionsWithCreator.length };
  } catch (error) {
    console.error("Error seeding questions:", error);
    throw error;
  }
}
