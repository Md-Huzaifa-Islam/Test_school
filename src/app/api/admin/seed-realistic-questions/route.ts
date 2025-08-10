import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import User from "@/models/User";
import mongoose from "mongoose";

// Realistic questions for each competency and level
const realQuestions = {
  // A1 Level Questions
  A1: {
    Writing: [
      {
        question: "Choose the correct way to introduce yourself in an email:",
        options: [
          "My name is John Smith.",
          "I am calling John Smith.",
          "This is John Smith speaking.",
          "John Smith here am I.",
        ],
        correctAnswer: 0,
        explanation:
          "In written form, 'My name is...' is the most appropriate formal introduction.",
      },
      {
        question: "Complete the sentence: 'I _____ from New York.'",
        options: ["am come", "come", "coming", "comes"],
        correctAnswer: 1,
        explanation:
          "The simple present tense 'come' is correct for stating origin.",
      },
      {
        question: "Which sentence correctly asks about someone's job?",
        options: [
          "What you do for work?",
          "What do you work?",
          "What is your job?",
          "What working you do?",
        ],
        correctAnswer: 2,
        explanation:
          "'What is your job?' is the most natural and grammatically correct way to ask about someone's occupation.",
      },
      {
        question: "How do you politely ask for help in writing?",
        options: [
          "Help me now!",
          "Could you please help me?",
          "You must help me.",
          "I need help immediately.",
        ],
        correctAnswer: 1,
        explanation:
          "'Could you please help me?' is polite and uses proper modal verb for requests.",
      },
      {
        question:
          "Complete the sentence: 'There _____ three books on the table.'",
        options: ["is", "are", "was", "have"],
        correctAnswer: 1,
        explanation:
          "'Are' is correct because 'books' is plural and we use 'there are' for plural nouns.",
      },
    ],
    Reading: [
      {
        question:
          "Read: 'The library opens at 9 AM and closes at 6 PM.' When does the library close?",
        options: ["9 AM", "6 PM", "9 PM", "6 AM"],
        correctAnswer: 1,
        explanation: "The text clearly states the library closes at 6 PM.",
      },
      {
        question:
          "Read: 'Please bring your passport and boarding pass.' What two things do you need?",
        options: [
          "Passport and ticket",
          "Passport and boarding pass",
          "Boarding pass and luggage",
          "Ticket and luggage",
        ],
        correctAnswer: 1,
        explanation:
          "The text specifically mentions 'passport and boarding pass'.",
      },
      {
        question:
          "Read: 'The weather today is sunny and warm.' How is the weather?",
        options: [
          "Cold and rainy",
          "Sunny and warm",
          "Cloudy and cool",
          "Windy and cold",
        ],
        correctAnswer: 1,
        explanation:
          "The text directly states the weather is 'sunny and warm'.",
      },
      {
        question:
          "Read: 'Bus number 42 goes to the airport.' Which bus goes to the airport?",
        options: ["Bus 24", "Bus 42", "Bus 52", "Bus 34"],
        correctAnswer: 1,
        explanation:
          "The text clearly states 'Bus number 42 goes to the airport'.",
      },
      {
        question:
          "Read: 'The store is closed on Sundays.' When is the store closed?",
        options: ["Mondays", "Saturdays", "Sundays", "Fridays"],
        correctAnswer: 2,
        explanation:
          "The text explicitly says 'The store is closed on Sundays'.",
      },
    ],
    Listening: [
      {
        question:
          "You hear: 'The train to London leaves at 3:30.' What time does the train leave?",
        options: ["3:00", "3:30", "4:30", "2:30"],
        correctAnswer: 1,
        explanation:
          "The announcement clearly states the train leaves at 3:30.",
      },
      {
        question:
          "You hear: 'Please take a seat and wait.' What should you do?",
        options: [
          "Stand and wait",
          "Leave immediately",
          "Sit down and wait",
          "Ask for directions",
        ],
        correctAnswer: 2,
        explanation: "'Take a seat' means to sit down.",
      },
      {
        question:
          "You hear: 'The meeting is on the second floor.' Where is the meeting?",
        options: ["First floor", "Second floor", "Third floor", "Ground floor"],
        correctAnswer: 1,
        explanation: "The speaker clearly says 'second floor'.",
      },
      {
        question:
          "You hear: 'Turn left at the traffic light.' What direction should you go?",
        options: ["Right", "Straight", "Left", "Back"],
        correctAnswer: 2,
        explanation: "The instruction is to 'turn left'.",
      },
      {
        question:
          "You hear: 'The price is fifteen dollars.' How much does it cost?",
        options: ["$50", "$15", "$5", "$25"],
        correctAnswer: 1,
        explanation: "Fifteen dollars means $15.",
      },
    ],
    Speaking: [
      {
        question: "How do you greet someone in the morning?",
        options: [
          "Good night",
          "Good evening",
          "Good morning",
          "Good afternoon",
        ],
        correctAnswer: 2,
        explanation:
          "'Good morning' is the appropriate greeting for morning time.",
      },
      {
        question: "What do you say when you want to order food?",
        options: [
          "I want to buy food",
          "Give me food",
          "I would like to order, please",
          "Food for me",
        ],
        correctAnswer: 2,
        explanation:
          "'I would like to order, please' is polite and appropriate for restaurants.",
      },
      {
        question: "How do you ask for the price of something?",
        options: [
          "How much money?",
          "How much does this cost?",
          "What money is this?",
          "How much price?",
        ],
        correctAnswer: 1,
        explanation:
          "'How much does this cost?' is the correct way to ask about price.",
      },
      {
        question: "What do you say when someone thanks you?",
        options: [
          "Thank you too",
          "Yes, please",
          "You're welcome",
          "No problem, thank you",
        ],
        correctAnswer: 2,
        explanation:
          "'You're welcome' is the standard polite response to 'thank you'.",
      },
      {
        question: "How do you ask for directions to the bathroom?",
        options: [
          "Where bathroom?",
          "Bathroom where is?",
          "Where is the bathroom, please?",
          "Bathroom direction?",
        ],
        correctAnswer: 2,
        explanation:
          "'Where is the bathroom, please?' is grammatically correct and polite.",
      },
    ],
  },
  // A2 Level Questions
  A2: {
    Writing: [
      {
        question:
          "Choose the correct past tense: 'Yesterday, I _____ to the supermarket.'",
        options: ["go", "went", "going", "goes"],
        correctAnswer: 1,
        explanation: "'Went' is the past tense of 'go', used with 'yesterday'.",
      },
      {
        question: "Complete: 'If it rains tomorrow, we _____ stay inside.'",
        options: ["will", "would", "can", "should"],
        correctAnswer: 0,
        explanation: "First conditional uses 'will' in the main clause.",
      },
      {
        question: "Which sentence uses the present perfect correctly?",
        options: [
          "I have seen that movie yesterday.",
          "I have seen that movie before.",
          "I have see that movie before.",
          "I has seen that movie before.",
        ],
        correctAnswer: 1,
        explanation:
          "Present perfect with 'before' doesn't use specific past time references.",
      },
      {
        question:
          "Choose the correct comparative: 'This book is _____ than that one.'",
        options: [
          "more interesting",
          "most interesting",
          "interesting",
          "much interesting",
        ],
        correctAnswer: 0,
        explanation:
          "For adjectives with more than one syllable, use 'more + adjective' for comparison.",
      },
      {
        question: "Complete: 'I'm looking forward _____ you again.'",
        options: ["to see", "to seeing", "see", "seeing"],
        correctAnswer: 1,
        explanation: "'Looking forward to' is followed by gerund (-ing form).",
      },
    ],
    Reading: [
      {
        question:
          "Read: 'Although it was raining, we decided to go for a walk.' What does this tell us?",
        options: [
          "They didn't go because of rain",
          "They went despite the rain",
          "They went before it rained",
          "They waited for the rain to stop",
        ],
        correctAnswer: 1,
        explanation:
          "'Although' indicates contrast - they went walking despite the rain.",
      },
      {
        question:
          "Read: 'The concert has been postponed due to technical difficulties.' What happened?",
        options: [
          "The concert was cancelled",
          "The concert was moved to a different time",
          "The concert started late",
          "The concert had sound problems",
        ],
        correctAnswer: 1,
        explanation: "'Postponed' means delayed or moved to a later time.",
      },
      {
        question:
          "Read: 'Students must submit their assignments by Friday.' What is required?",
        options: [
          "Students can submit anytime",
          "Students should submit before Friday",
          "Students must submit on or before Friday",
          "Students can submit after Friday",
        ],
        correctAnswer: 2,
        explanation: "'By Friday' means on or before Friday, not after.",
      },
      {
        question:
          "Read: 'The package will be delivered within 3-5 business days.' When will it arrive?",
        options: [
          "Exactly 3 days",
          "Exactly 5 days",
          "Between 3-5 working days",
          "Within 3-5 weeks",
        ],
        correctAnswer: 2,
        explanation:
          "'Within 3-5 business days' means it could arrive anytime during that period.",
      },
      {
        question:
          "Read: 'Please note that smoking is prohibited in all areas.' What does this mean?",
        options: [
          "Smoking is allowed everywhere",
          "Smoking is not allowed anywhere",
          "Smoking is allowed in some areas",
          "Smoking rules are not clear",
        ],
        correctAnswer: 1,
        explanation:
          "'Prohibited in all areas' means smoking is not allowed anywhere.",
      },
    ],
    Listening: [
      {
        question:
          "You hear: 'I'm afraid the doctor is running late today.' What does this mean?",
        options: [
          "The doctor is exercising",
          "The doctor is behind schedule",
          "The doctor is scared",
          "The doctor is very fast",
        ],
        correctAnswer: 1,
        explanation: "'Running late' means being behind schedule or delayed.",
      },
      {
        question:
          "You hear: 'Could you please speak up? I can barely hear you.' What is the problem?",
        options: [
          "The person is speaking too fast",
          "The person is speaking too loudly",
          "The person is speaking too quietly",
          "The person is speaking unclearly",
        ],
        correctAnswer: 2,
        explanation:
          "'Speak up' and 'barely hear' indicate the person needs to speak louder.",
      },
      {
        question:
          "You hear: 'The flight has been delayed by two hours.' What happened?",
        options: [
          "The flight left two hours early",
          "The flight will be two hours late",
          "The flight takes two hours",
          "The flight was cancelled",
        ],
        correctAnswer: 1,
        explanation:
          "'Delayed by two hours' means the flight will be two hours later than scheduled.",
      },
      {
        question:
          "You hear: 'I'll pick you up at half past seven.' What time will they arrive?",
        options: ["7:00", "7:30", "8:30", "6:30"],
        correctAnswer: 1,
        explanation: "'Half past seven' means 7:30.",
      },
      {
        question:
          "You hear: 'Don't forget to bring your umbrella.' What is the speaker suggesting?",
        options: [
          "It might rain",
          "It's very sunny",
          "It's very cold",
          "It's very windy",
        ],
        correctAnswer: 0,
        explanation: "Umbrellas are typically used for rain protection.",
      },
    ],
    Speaking: [
      {
        question: "How do you politely disagree with someone?",
        options: [
          "You are wrong",
          "That's not true",
          "I see your point, but I think...",
          "No, you don't understand",
        ],
        correctAnswer: 2,
        explanation:
          "'I see your point, but...' is a polite way to express disagreement.",
      },
      {
        question: "What do you say when making a suggestion?",
        options: [
          "You must do this",
          "Why don't we try...?",
          "You have to listen",
          "This is what you do",
        ],
        correctAnswer: 1,
        explanation:
          "'Why don't we try...?' is a polite way to make suggestions.",
      },
      {
        question: "How do you ask for someone's opinion?",
        options: [
          "Tell me what you think",
          "What do you think about...?",
          "You should think about this",
          "Think about this question",
        ],
        correctAnswer: 1,
        explanation:
          "'What do you think about...?' is the standard way to ask for opinions.",
      },
      {
        question: "What do you say when you don't understand something?",
        options: [
          "I don't know",
          "Could you repeat that, please?",
          "That's wrong",
          "I'm not listening",
        ],
        correctAnswer: 1,
        explanation:
          "'Could you repeat that, please?' politely asks for clarification.",
      },
      {
        question: "How do you express a preference?",
        options: [
          "I must have coffee",
          "Coffee is the best",
          "I'd prefer coffee, please",
          "Give me coffee only",
        ],
        correctAnswer: 2,
        explanation: "'I'd prefer...' is the polite way to express preference.",
      },
    ],
  },
  // B1 Level Questions
  B1: {
    Writing: [
      {
        question:
          "Choose the correct conditional: 'If I _____ enough money, I would travel around the world.'",
        options: ["have", "had", "will have", "would have"],
        correctAnswer: 1,
        explanation: "Second conditional uses past tense in the if-clause.",
      },
      {
        question: "Complete: 'The report _____ by the team yesterday.'",
        options: ["completed", "was completed", "has completed", "completing"],
        correctAnswer: 1,
        explanation: "Passive voice with past tense: 'was completed'.",
      },
      {
        question:
          "Which sentence uses the present perfect continuous correctly?",
        options: [
          "I have been working here for five years.",
          "I am working here for five years.",
          "I worked here for five years.",
          "I have worked here since five years.",
        ],
        correctAnswer: 0,
        explanation:
          "Present perfect continuous shows ongoing action from past to present.",
      },
      {
        question:
          "Choose the correct relative pronoun: 'The person _____ called you is waiting outside.'",
        options: ["which", "whose", "who", "where"],
        correctAnswer: 2,
        explanation:
          "'Who' is used for people as the subject of the relative clause.",
      },
      {
        question: "Complete: 'I wish I _____ speak French fluently.'",
        options: ["can", "could", "will", "would"],
        correctAnswer: 1,
        explanation: "'I wish' + past tense (could) expresses present regret.",
      },
    ],
    Reading: [
      {
        question:
          "Read this job posting: 'Candidates should have excellent communication skills and be willing to work flexible hours.' What is required?",
        options: [
          "Only communication skills",
          "Only flexible schedule",
          "Both communication skills and flexible hours",
          "Either communication skills or flexible hours",
        ],
        correctAnswer: 2,
        explanation: "'And' indicates both requirements are necessary.",
      },
      {
        question:
          "Read: 'The new policy will come into effect next month, provided that all departments approve it.' When will the policy start?",
        options: [
          "Immediately",
          "Next month if approved",
          "Next month regardless",
          "Only if some departments approve",
        ],
        correctAnswer: 1,
        explanation:
          "'Provided that' introduces a condition - approval is required.",
      },
      {
        question:
          "Read: 'Despite numerous attempts to contact the supplier, we have not received a response.' What happened?",
        options: [
          "They contacted the supplier once",
          "They received many responses",
          "They tried many times but got no response",
          "They didn't try to contact the supplier",
        ],
        correctAnswer: 2,
        explanation:
          "'Despite numerous attempts' indicates many tries with no success.",
      },
      {
        question:
          "Read: 'The research findings suggest that regular exercise may reduce the risk of heart disease.' What does this mean?",
        options: [
          "Exercise definitely prevents heart disease",
          "Exercise might help prevent heart disease",
          "Exercise causes heart disease",
          "Exercise has no effect on heart disease",
        ],
        correctAnswer: 1,
        explanation: "'Suggest' and 'may' indicate possibility, not certainty.",
      },
      {
        question:
          "Read: 'Participants who fail to submit their forms by the deadline will be automatically disqualified.' What happens if you're late?",
        options: [
          "You get extra time",
          "You are removed from the program",
          "You receive a warning",
          "Nothing happens",
        ],
        correctAnswer: 1,
        explanation:
          "'Automatically disqualified' means immediate removal from the program.",
      },
    ],
    Listening: [
      {
        question:
          "You hear: 'I'd rather not commit to anything until I've had a chance to review the proposal.' What is the speaker doing?",
        options: [
          "Accepting immediately",
          "Rejecting the proposal",
          "Asking for time to consider",
          "Making a counteroffer",
        ],
        correctAnswer: 2,
        explanation:
          "'I'd rather not commit until...' indicates wanting time to review.",
      },
      {
        question:
          "You hear: 'The conference has been put off indefinitely due to unforeseen circumstances.' What happened?",
        options: [
          "The conference was cancelled permanently",
          "The conference was postponed with no new date",
          "The conference was moved to a different location",
          "The conference was shortened",
        ],
        correctAnswer: 1,
        explanation:
          "'Put off indefinitely' means postponed without a specific new date.",
      },
      {
        question:
          "You hear: 'I'm at a loss for words. I really don't know what to say.' How does the speaker feel?",
        options: [
          "Confused and unable to respond",
          "Angry and frustrated",
          "Happy and excited",
          "Bored and uninterested",
        ],
        correctAnswer: 0,
        explanation:
          "'At a loss for words' means unable to find appropriate words to respond.",
      },
      {
        question:
          "You hear: 'The project is behind schedule, but we're working around the clock to catch up.' What are they doing?",
        options: [
          "Working normal hours",
          "Working continuously to recover time",
          "Taking breaks frequently",
          "Stopping work on the project",
        ],
        correctAnswer: 1,
        explanation:
          "'Working around the clock' means working continuously, day and night.",
      },
      {
        question:
          "You hear: 'I'm afraid I have to take issue with your assessment of the situation.' What is the speaker doing?",
        options: [
          "Agreeing completely",
          "Asking for clarification",
          "Expressing disagreement",
          "Showing fear",
        ],
        correctAnswer: 2,
        explanation:
          "'Take issue with' means to disagree or object to something.",
      },
    ],
    Speaking: [
      {
        question: "How do you express probability in English?",
        options: [
          "It will definitely happen",
          "It might happen",
          "It must happen",
          "All of the above",
        ],
        correctAnswer: 3,
        explanation:
          "All these expressions show different levels of probability.",
      },
      {
        question: "What's the best way to give advice?",
        options: [
          "You must do this",
          "You should consider...",
          "Do this now",
          "This is the only way",
        ],
        correctAnswer: 1,
        explanation:
          "'You should consider...' is diplomatic and gives room for choice.",
      },
      {
        question: "How do you express a hypothesis?",
        options: [
          "I know that...",
          "I think that...",
          "If I were to guess, I'd say...",
          "This is definitely...",
        ],
        correctAnswer: 2,
        explanation:
          "'If I were to guess...' appropriately introduces a hypothesis.",
      },
      {
        question: "What's an appropriate way to interrupt politely?",
        options: [
          "Stop talking",
          "Excuse me, may I interrupt?",
          "Be quiet",
          "Listen to me",
        ],
        correctAnswer: 1,
        explanation: "'Excuse me, may I interrupt?' is polite and respectful.",
      },
      {
        question: "How do you express uncertainty?",
        options: [
          "I'm absolutely sure",
          "I'm not quite sure about...",
          "This is definitely true",
          "I know for certain",
        ],
        correctAnswer: 1,
        explanation:
          "'I'm not quite sure about...' appropriately expresses uncertainty.",
      },
    ],
  },
  // B2 Level Questions
  B2: {
    Writing: [
      {
        question:
          "Choose the most sophisticated way to express cause and effect:",
        options: [
          "Because of the rain, we stayed inside",
          "The inclement weather necessitated our remaining indoors",
          "It rained so we stayed inside",
          "We stayed inside when it rained",
        ],
        correctAnswer: 1,
        explanation:
          "This uses more advanced vocabulary and formal structure appropriate for B2 level.",
      },
      {
        question:
          "Complete with the most appropriate modal: 'You _____ have informed me about the changes earlier.'",
        options: ["could", "should", "would", "might"],
        correctAnswer: 1,
        explanation:
          "'Should have' expresses past obligation or criticism appropriately.",
      },
      {
        question: "Which sentence shows the most advanced use of inversion?",
        options: [
          "I have never seen such a beautiful sunset",
          "Never have I seen such a beautiful sunset",
          "I never saw such a beautiful sunset",
          "Such a beautiful sunset I have never seen",
        ],
        correctAnswer: 1,
        explanation:
          "Inversion with 'never' at the beginning shows advanced grammar.",
      },
      {
        question: "Choose the most appropriate formal connector:",
        options: [
          "But the results were disappointing",
          "However, the results were disappointing",
          "The results were disappointing though",
          "Still, the results were disappointing",
        ],
        correctAnswer: 1,
        explanation:
          "'However' is the most formal and appropriate connector for academic writing.",
      },
      {
        question:
          "Complete: 'The committee recommended that the proposal _____ revised.'",
        options: ["is", "was", "be", "would be"],
        correctAnswer: 2,
        explanation:
          "Subjunctive 'be' is used after 'recommend that' in formal English.",
      },
    ],
    Reading: [
      {
        question:
          "Read: 'The proliferation of digital technologies has fundamentally transformed the landscape of modern communication.' What does 'proliferation' mean?",
        options: ["Reduction", "Rapid increase", "Improvement", "Complication"],
        correctAnswer: 1,
        explanation: "'Proliferation' means rapid increase or multiplication.",
      },
      {
        question:
          "Read: 'Notwithstanding the compelling evidence presented, the jury remained unconvinced.' What does this mean?",
        options: [
          "Because of the evidence, the jury was convinced",
          "Despite the strong evidence, the jury wasn't convinced",
          "The evidence was weak, so the jury wasn't convinced",
          "The jury was convinced by some evidence",
        ],
        correctAnswer: 1,
        explanation: "'Notwithstanding' means 'despite' or 'in spite of'.",
      },
      {
        question:
          "Read: 'The research methodology employed was both rigorous and innovative.' What can we infer?",
        options: [
          "The research was poorly designed",
          "The research used standard methods",
          "The research was thorough and creative",
          "The research was confusing",
        ],
        correctAnswer: 2,
        explanation:
          "'Rigorous' means thorough and 'innovative' means creative/new.",
      },
      {
        question:
          "Read: 'The implications of this discovery are far-reaching and warrant further investigation.' What does this suggest?",
        options: [
          "The discovery is unimportant",
          "The discovery has limited impact",
          "The discovery has wide-ranging consequences and deserves more study",
          "The discovery is already fully understood",
        ],
        correctAnswer: 2,
        explanation:
          "'Far-reaching' means having wide consequences, 'warrant' means deserve.",
      },
      {
        question:
          "Read: 'The author's argument is predicated on the assumption that economic growth is inherently sustainable.' What does this mean?",
        options: [
          "The argument assumes economic growth is naturally sustainable",
          "The argument proves economic growth is sustainable",
          "The argument rejects the idea of sustainable growth",
          "The argument questions sustainable growth",
        ],
        correctAnswer: 0,
        explanation:
          "'Predicated on' means based on; the argument assumes something without proving it.",
      },
    ],
    Listening: [
      {
        question:
          "You hear: 'I'm inclined to believe that the initial assessment may have been somewhat overly optimistic.' What is the speaker saying?",
        options: [
          "The assessment was definitely wrong",
          "The assessment was probably too positive",
          "The assessment was perfect",
          "The assessment was too negative",
        ],
        correctAnswer: 1,
        explanation:
          "'Inclined to believe' suggests opinion; 'overly optimistic' means too positive.",
      },
      {
        question:
          "You hear: 'The proposal has merit, albeit with certain reservations that need to be addressed.' What's the speaker's view?",
        options: [
          "Complete approval",
          "Complete rejection",
          "Qualified approval with concerns",
          "Uncertainty about the proposal",
        ],
        correctAnswer: 2,
        explanation:
          "'Has merit' is positive, 'albeit with reservations' shows conditional approval.",
      },
      {
        question:
          "You hear: 'I would venture to say that this represents a paradigm shift in our understanding.' How certain is the speaker?",
        options: [
          "Completely certain",
          "Somewhat tentative but confident",
          "Very uncertain",
          "Completely uncertain",
        ],
        correctAnswer: 1,
        explanation:
          "'Venture to say' shows some caution but confidence in the statement.",
      },
      {
        question:
          "You hear: 'The findings are inconclusive at best, and potentially misleading at worst.' What's the speaker's assessment?",
        options: [
          "The findings are excellent",
          "The findings are good but not perfect",
          "The findings range from unclear to possibly wrong",
          "The findings are definitely wrong",
        ],
        correctAnswer: 2,
        explanation:
          "'Inconclusive at best' to 'misleading at worst' shows a range from unclear to problematic.",
      },
      {
        question:
          "You hear: 'While I appreciate your perspective, I feel compelled to offer an alternative viewpoint.' What is happening?",
        options: [
          "Agreement with the previous speaker",
          "Polite disagreement with alternative view",
          "Confusion about the topic",
          "Request for clarification",
        ],
        correctAnswer: 1,
        explanation:
          "'While I appreciate' shows respect, 'compelled to offer alternative' indicates disagreement.",
      },
    ],
    Speaking: [
      {
        question: "How do you express a nuanced opinion at B2 level?",
        options: [
          "I think it's good",
          "While there are merits to this approach, certain aspects warrant further consideration",
          "It's okay",
          "I like it",
        ],
        correctAnswer: 1,
        explanation:
          "B2 level requires sophisticated language showing complexity of thought.",
      },
      {
        question: "What's an appropriate way to present a counterargument?",
        options: [
          "That's wrong",
          "I disagree",
          "One could argue, however, that...",
          "No, you're mistaken",
        ],
        correctAnswer: 2,
        explanation:
          "'One could argue, however' is sophisticated and diplomatic.",
      },
      {
        question: "How do you express speculation at B2 level?",
        options: [
          "Maybe it will happen",
          "It might conceivably lead to...",
          "I think it will happen",
          "It will probably happen",
        ],
        correctAnswer: 1,
        explanation:
          "'Conceivably' shows advanced vocabulary for expressing possibility.",
      },
      {
        question: "What's the best way to qualify a statement?",
        options: [
          "This is true",
          "To a certain extent, this appears to be the case",
          "This is right",
          "This is correct",
        ],
        correctAnswer: 1,
        explanation:
          "Qualifying language shows sophisticated thinking and appropriate caution.",
      },
      {
        question: "How do you express emphasis sophisticatedly?",
        options: [
          "This is very important",
          "I cannot overstate the significance of...",
          "This is really big",
          "This matters a lot",
        ],
        correctAnswer: 1,
        explanation:
          "'Cannot overstate the significance' is sophisticated formal emphasis.",
      },
    ],
  },
  // C1 Level Questions
  C1: {
    Writing: [
      {
        question: "Choose the most sophisticated expression of contrast:",
        options: [
          "But the data shows different results",
          "Conversely, the empirical evidence suggests a markedly different conclusion",
          "However, the data is different",
          "The data shows something else though",
        ],
        correctAnswer: 1,
        explanation:
          "C1 level requires sophisticated vocabulary and complex sentence structures.",
      },
      {
        question:
          "Complete with the most appropriate subjunctive: 'It is imperative that every participant _____ the guidelines meticulously.'",
        options: ["follows", "follow", "will follow", "would follow"],
        correctAnswer: 1,
        explanation:
          "Subjunctive mood uses base form 'follow' after expressions of necessity.",
      },
      {
        question:
          "Which demonstrates the most sophisticated use of nominalization?",
        options: [
          "The committee decided quickly",
          "The committee made a quick decision",
          "The expeditious decision-making process of the committee",
          "The committee decided in a quick way",
        ],
        correctAnswer: 2,
        explanation:
          "Nominalization with sophisticated adjectives shows C1 level writing.",
      },
      {
        question: "Choose the most appropriate academic hedge:",
        options: [
          "The results show that...",
          "The results seem to indicate that...",
          "The data would appear to suggest that...",
          "The findings prove that...",
        ],
        correctAnswer: 2,
        explanation:
          "Multiple hedging expressions show sophisticated academic caution.",
      },
      {
        question:
          "Complete: '_____ the overwhelming evidence to the contrary, some researchers maintain their original hypothesis.'",
        options: ["Despite", "In spite of", "Notwithstanding", "Although"],
        correctAnswer: 2,
        explanation:
          "'Notwithstanding' is the most formal and sophisticated choice for C1 level.",
      },
    ],
    Reading: [
      {
        question:
          "Read: 'The phenomenon exhibits a propensity for manifestation predominantly in urban environments, albeit with notable exceptions in certain rural contexts.' What does this mean?",
        options: [
          "It only happens in cities",
          "It mainly occurs in cities but sometimes in rural areas too",
          "It never happens in rural areas",
          "It happens equally everywhere",
        ],
        correctAnswer: 1,
        explanation:
          "'Propensity for manifestation predominantly' means tends to occur mainly; 'albeit' introduces exceptions.",
      },
      {
        question:
          "Read: 'The author's thesis is predicated upon a somewhat tenuous correlation between disparate variables.' What is being criticized?",
        options: [
          "The strong connection between variables",
          "The weak relationship the argument depends on",
          "The number of variables used",
          "The author's writing style",
        ],
        correctAnswer: 1,
        explanation:
          "'Tenuous correlation' means weak relationship; 'predicated upon' means based on.",
      },
      {
        question:
          "Read: 'The study's methodology, while ostensibly rigorous, suffers from inherent limitations that may compromise its validity.' What's the criticism?",
        options: [
          "The methodology is definitely rigorous",
          "The methodology appears rigorous but has fundamental flaws",
          "The methodology is completely invalid",
          "The methodology is too simple",
        ],
        correctAnswer: 1,
        explanation:
          "'Ostensibly' means apparently but not necessarily truly; 'inherent limitations' are built-in flaws.",
      },
      {
        question:
          "Read: 'The discourse surrounding this topic has been characterized by a paucity of empirical evidence and an abundance of speculative conjecture.' What's the problem?",
        options: [
          "Too much evidence and too little speculation",
          "Not enough evidence and too much guessing",
          "Perfect balance of evidence and theory",
          "Too much technical language",
        ],
        correctAnswer: 1,
        explanation:
          "'Paucity' means scarcity; 'speculative conjecture' means guesswork without evidence.",
      },
      {
        question:
          "Read: 'The ramifications of this paradigmatic shift are likely to reverberate throughout the academic community for decades to come.' What does this suggest?",
        options: [
          "Small, temporary changes",
          "Major, long-lasting effects on academia",
          "No significant impact",
          "Immediate but brief consequences",
        ],
        correctAnswer: 1,
        explanation:
          "'Paradigmatic shift' means fundamental change; 'reverberate throughout...for decades' indicates long-term, wide impact.",
      },
    ],
    Listening: [
      {
        question:
          "You hear: 'I would posit that the conventional wisdom regarding this matter may be somewhat misguided, if not entirely fallacious.' What is the speaker suggesting?",
        options: [
          "The common view is definitely correct",
          "The common view might be wrong or completely false",
          "The common view needs minor adjustments",
          "The common view is partially correct",
        ],
        correctAnswer: 1,
        explanation:
          "'Posit' means propose; 'misguided, if not entirely fallacious' suggests wrong to completely false.",
      },
      {
        question:
          "You hear: 'The efficacy of this intervention remains, at best, marginal, and its implementation would necessitate considerable resource allocation.' What's the assessment?",
        options: [
          "Highly effective and cheap",
          "Barely effective and expensive",
          "Very effective but expensive",
          "Ineffective but cheap",
        ],
        correctAnswer: 1,
        explanation:
          "'Marginal efficacy' means barely effective; 'considerable resource allocation' means expensive.",
      },
      {
        question:
          "You hear: 'While I acknowledge the theoretical underpinnings of your argument, the practical implications remain somewhat nebulous.' What's the concern?",
        options: [
          "The theory is wrong",
          "The theory is sound but practical effects are unclear",
          "Both theory and practice are clear",
          "The argument has no theoretical basis",
        ],
        correctAnswer: 1,
        explanation:
          "'Acknowledge theoretical underpinnings' accepts the theory; 'nebulous implications' means unclear practical effects.",
      },
      {
        question:
          "You hear: 'The correlation, while statistically significant, may be spurious given the multitude of confounding variables.' What's the warning?",
        options: [
          "The correlation is definitely real",
          "The correlation might be false due to other factors",
          "There are no other factors to consider",
          "The statistics are wrong",
        ],
        correctAnswer: 1,
        explanation:
          "'Spurious correlation' means false relationship; 'confounding variables' are interfering factors.",
      },
      {
        question:
          "You hear: 'I'm disinclined to endorse this proposition given the paucity of corroborating evidence.' What's the position?",
        options: [
          "Strong support for the idea",
          "Reluctance to support due to lack of supporting evidence",
          "Complete rejection of the idea",
          "Neutral position on the matter",
        ],
        correctAnswer: 1,
        explanation:
          "'Disinclined to endorse' means reluctant to support; 'paucity of corroborating evidence' means lack of supporting proof.",
      },
    ],
    Speaking: [
      {
        question: "How do you express sophisticated disagreement at C1 level?",
        options: [
          "I disagree with you",
          "That's not right",
          "I'm afraid I must respectfully take issue with that assertion",
          "No, you're wrong",
        ],
        correctAnswer: 2,
        explanation:
          "C1 requires sophisticated, diplomatic language even for disagreement.",
      },
      {
        question: "What's an appropriate way to present a complex argument?",
        options: [
          "I think this because...",
          "While acknowledging the validity of alternative perspectives, I would contend that...",
          "This is right because...",
          "My opinion is...",
        ],
        correctAnswer: 1,
        explanation:
          "Shows recognition of complexity and sophisticated argumentation structure.",
      },
      {
        question: "How do you express intellectual humility at C1 level?",
        options: [
          "I might be wrong",
          "I'm not sure",
          "I readily concede that my understanding may be incomplete",
          "Maybe I'm mistaken",
        ],
        correctAnswer: 2,
        explanation:
          "'Readily concede' and formal structure show sophisticated intellectual humility.",
      },
      {
        question:
          "What's the most sophisticated way to introduce a qualification?",
        options: [
          "But there's a problem",
          "However, one must consider...",
          "That said, it behooves us to consider the attendant complications",
          "Still, there are issues",
        ],
        correctAnswer: 2,
        explanation:
          "'Behooves us' and 'attendant complications' show C1 level sophistication.",
      },
      {
        question: "How do you express probability with maximum sophistication?",
        options: [
          "It will probably happen",
          "The likelihood of occurrence would appear to be considerable",
          "It might happen",
          "There's a good chance",
        ],
        correctAnswer: 1,
        explanation:
          "Formal, precise language with sophisticated probability assessment.",
      },
    ],
  },
  // C2 Level Questions
  C2: {
    Writing: [
      {
        question: "Choose the most sophisticated expression of causality:",
        options: [
          "This caused the problem",
          "This resulted in the issue",
          "This precipitated the aforementioned predicament",
          "This led to the problem",
        ],
        correctAnswer: 2,
        explanation:
          "C2 level requires the most sophisticated vocabulary and formal register.",
      },
      {
        question:
          "Complete with the most nuanced conditional: 'Were the circumstances _____ different, the outcome might have been more favorable.'",
        options: ["slightly", "somewhat", "marginally", "appreciably"],
        correctAnswer: 3,
        explanation:
          "'Appreciably' suggests a meaningful degree of difference, showing precise meaning.",
      },
      {
        question:
          "Which demonstrates the highest level of stylistic sophistication?",
        options: [
          "The research shows important results",
          "The investigation yields significant findings",
          "The inquiry yields findings of considerable import",
          "The study has important results",
        ],
        correctAnswer: 2,
        explanation:
          "'Inquiry yields findings of considerable import' shows maximum linguistic sophistication.",
      },
      {
        question: "Choose the most refined expression of reservation:",
        options: [
          "I have some doubts about this",
          "I'm not completely convinced",
          "I harbor certain misgivings regarding this proposition",
          "I'm not sure about this",
        ],
        correctAnswer: 2,
        explanation:
          "'Harbor misgivings regarding' shows C2 level refinement and precision.",
      },
      {
        question:
          "Complete: 'The scholar's erudition was _____, encompassing diverse fields of knowledge.'",
        options: ["impressive", "remarkable", "prodigious", "good"],
        correctAnswer: 2,
        explanation:
          "'Prodigious' is the most sophisticated and precise term for exceptional scholarly knowledge.",
      },
    ],
    Reading: [
      {
        question:
          "Read: 'The author's perspicacious analysis elucidates the most recondite aspects of the phenomenon with remarkable acuity.' What is being praised?",
        options: [
          "The author's simple explanation",
          "The author's insightful explanation of hidden complexities",
          "The author's basic understanding",
          "The author's confused analysis",
        ],
        correctAnswer: 1,
        explanation:
          "'Perspicacious' means insightful; 'elucidates recondite aspects' means explains hidden complexities.",
      },
      {
        question:
          "Read: 'The protagonist's weltanschauung undergoes a profound metamorphosis, rendering her erstwhile convictions untenable.' What happens?",
        options: [
          "Her worldview changes completely, making her old beliefs impossible to maintain",
          "She becomes more confident in her beliefs",
          "Her opinions stay the same",
          "She becomes confused about everything",
        ],
        correctAnswer: 0,
        explanation:
          "'Weltanschauung' is worldview; 'metamorphosis' is transformation; 'erstwhile convictions untenable' means former beliefs can't be sustained.",
      },
      {
        question:
          "Read: 'The critic's vituperative assessment of the work betrays a fundamental misapprehension of the artist's oeuvre.' What's being suggested?",
        options: [
          "The critic understood the work perfectly",
          "The critic's harsh criticism shows misunderstanding of the artist's complete works",
          "The critic was too kind in the review",
          "The artist's work is clearly bad",
        ],
        correctAnswer: 1,
        explanation:
          "'Vituperative' means harshly critical; 'betrays misapprehension of oeuvre' means shows misunderstanding of complete works.",
      },
      {
        question:
          "Read: 'The dialectical tensions inherent in the theoretical framework preclude any facile resolution of the apparent contradictions.' What does this mean?",
        options: [
          "The contradictions are easy to resolve",
          "The opposing forces in the theory prevent simple solutions to contradictions",
          "There are no contradictions in the theory",
          "The theory is perfectly clear",
        ],
        correctAnswer: 1,
        explanation:
          "'Dialectical tensions' are opposing forces; 'preclude facile resolution' means prevent easy solutions.",
      },
      {
        question:
          "Read: 'The author's tour de force represents the apotheosis of a literary tradition that has been inexorably declining.' What assessment is made?",
        options: [
          "The work is mediocre in a strong tradition",
          "The work is the highest achievement of a dying literary tradition",
          "The tradition is growing stronger",
          "The work is typical of current literature",
        ],
        correctAnswer: 1,
        explanation:
          "'Tour de force' and 'apotheosis' mean masterpiece and highest point; 'inexorably declining' means unstoppably deteriorating.",
      },
    ],
    Listening: [
      {
        question:
          "You hear: 'The exigencies of the current situation militate against any precipitous action that might exacerbate an already tenuous equilibrium.' What is advised?",
        options: [
          "Act quickly and decisively",
          "Avoid hasty actions that could worsen a delicate balance",
          "Take immediate action regardless of consequences",
          "Ignore the current situation",
        ],
        correctAnswer: 1,
        explanation:
          "'Exigencies militate against precipitous action' means urgent needs argue against hasty action; 'tenuous equilibrium' means delicate balance.",
      },
      {
        question:
          "You hear: 'His ostentatious display of erudition serves merely to obfuscate rather than illuminate the fundamental issues at stake.' What's the criticism?",
        options: [
          "He shows appropriate knowledge clearly",
          "His showy display of learning confuses rather than clarifies key issues",
          "He doesn't know enough about the topic",
          "His explanation is perfectly clear",
        ],
        correctAnswer: 1,
        explanation:
          "'Ostentatious display of erudition' means showy learning; 'obfuscate rather than illuminate' means confuse rather than clarify.",
      },
      {
        question:
          "You hear: 'The verisimilitude of the narrative is undermined by the author's propensity for gratuitous embellishment.' What's wrong with the story?",
        options: [
          "It's too realistic",
          "Its believability is damaged by unnecessary decorative details",
          "It's too simple and plain",
          "It's perfectly believable",
        ],
        correctAnswer: 1,
        explanation:
          "'Verisimilitude' means believability; 'propensity for gratuitous embellishment' means tendency for unnecessary decoration.",
      },
      {
        question:
          "You hear: 'The lacuna in our understanding of this phenomenon renders any definitive pronouncement premature.' What's the situation?",
        options: [
          "We understand everything completely",
          "A gap in our knowledge makes final judgments too early",
          "We should make decisions immediately",
          "The phenomenon is fully explained",
        ],
        correctAnswer: 1,
        explanation:
          "'Lacuna' means gap; 'renders definitive pronouncement premature' means makes final statements too early.",
      },
      {
        question:
          "You hear: 'The scholar's magnum opus represents a synthesis of disparate intellectual traditions that had hitherto remained irreconcilable.' What achievement is described?",
        options: [
          "A minor work combining similar ideas",
          "A masterwork that unites previously incompatible intellectual traditions",
          "A simple summary of existing work",
          "A work that creates more divisions",
        ],
        correctAnswer: 1,
        explanation:
          "'Magnum opus' means greatest work; 'synthesis of disparate...hitherto irreconcilable' means combining different traditions that were previously impossible to unite.",
      },
    ],
    Speaking: [
      {
        question:
          "How do you express the most sophisticated form of intellectual disagreement?",
        options: [
          "I disagree completely",
          "That's totally wrong",
          "I find myself compelled to dissent from that particular formulation",
          "I don't think that's right",
        ],
        correctAnswer: 2,
        explanation:
          "C2 level requires the most refined and diplomatic expressions of disagreement.",
      },
      {
        question:
          "What's the most sophisticated way to express uncertainty about complex matters?",
        options: [
          "I'm not sure about this",
          "I have doubts",
          "The matter remains shrouded in considerable epistemic uncertainty",
          "I don't know",
        ],
        correctAnswer: 2,
        explanation:
          "'Epistemic uncertainty' shows the highest level of philosophical and linguistic sophistication.",
      },
      {
        question:
          "How do you most sophisticatedly introduce a counterintuitive point?",
        options: [
          "This might seem strange, but...",
          "Paradoxically...",
          "Counterintuitively, this ostensibly contradictory phenomenon...",
          "It's weird that...",
        ],
        correctAnswer: 2,
        explanation:
          "Shows maximum sophistication with precise technical vocabulary.",
      },
      {
        question:
          "What's the most refined way to express intellectual humility?",
        options: [
          "I could be wrong",
          "I might not understand completely",
          "I readily acknowledge the limitations of my own perspicacity in this matter",
          "Maybe I'm mistaken",
        ],
        correctAnswer: 2,
        explanation:
          "'Perspicacity' and formal structure show the highest level of intellectual sophistication.",
      },
      {
        question:
          "How do you most sophisticatedly qualify a complex statement?",
        options: [
          "This is generally true, but...",
          "While this holds in most cases...",
          "Notwithstanding certain caveats and provisos, this formulation appears tenable",
          "This is usually right, except...",
        ],
        correctAnswer: 2,
        explanation:
          "'Caveats and provisos' with formal register shows C2 level qualification skills.",
      },
    ],
  },
};

export async function POST() {
  try {
    await connectDB();

    // Get or create a system user for seeding
    let systemUser = await User.findOne({ email: "system@testschool.com" });
    if (!systemUser) {
      systemUser = new User({
        firstName: "System",
        lastName: "Administrator",
        email: "system@testschool.com",
        password: "system123", // This will be hashed
        role: "admin",
        isEmailVerified: true,
      });
      await systemUser.save();
      console.log("Created system user for seeding questions");
    }

    let totalCreated = 0;
    const competencies = ["Writing", "Reading", "Listening", "Speaking"];

    // Create questions for each level and competency
    for (const [level, levelQuestions] of Object.entries(realQuestions)) {
      console.log(`Creating questions for level: ${level}`);

      for (const competency of competencies) {
        const questions =
          levelQuestions[competency as keyof typeof levelQuestions];

        if (questions && Array.isArray(questions)) {
          for (let i = 0; i < questions.length; i++) {
            const questionData = questions[i];

            const question = new Question({
              competency,
              level,
              step: level.startsWith("A") ? 1 : level.startsWith("B") ? 2 : 3,
              question: questionData.question,
              options: questionData.options,
              correctAnswer: questionData.correctAnswer,
              explanation: questionData.explanation,
              difficulty: getDifficulty(level),
              isActive: true,
              createdBy: systemUser._id,
            });

            await question.save();
            totalCreated++;

            if (totalCreated % 10 === 0) {
              console.log(`Created ${totalCreated} questions so far...`);
            }
          }
        }
      }
    }

    console.log(`Successfully created ${totalCreated} realistic questions`);

    // Get count by level and competency for verification
    const questionCounts: Record<string, Record<string, number>> = {};
    for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
      questionCounts[level] = {};
      for (const competency of competencies) {
        const count = await Question.countDocuments({ level, competency });
        questionCounts[level][competency] = count;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${totalCreated} realistic questions`,
      totalCreated,
      questionCounts,
    });
  } catch (error) {
    console.error("Seed realistic questions error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed realistic questions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper function to determine difficulty based on level
function getDifficulty(level: string): "easy" | "medium" | "hard" {
  if (level.startsWith("A")) return "easy";
  if (level.startsWith("B")) return "medium";
  return "hard";
}
