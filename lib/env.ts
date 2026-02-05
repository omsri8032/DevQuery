const env = {
  appwrite: {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "",
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
    collectionIds: {
      questions: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_QUESTIONS || "questions",
      answers: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_ANSWERS || "answers",
      votes: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_VOTES || "votes",
    },
    apikey: process.env.APPWRITE_API_KEY || "",
  },
};

export default env;
