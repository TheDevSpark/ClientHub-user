// utils/caseData.js
export const cases = {
  "0001": {
    title: "Contract Review",
    caseId: "#0001",
    status: "In Progress",
    progress: 60,
    progressMessage: "We are working on your case and will update you soon.",
    caseType: "Contract Review",
    createdDate: "9/15/2024",
    lastUpdated: "10/3/2024",
    description: "Review and analysis of employment contract with non-compete clause.",
    updates: [
      { title: "Case opened", description: "Initial consultation completed", date: "9/15/2024" },
      { title: "Documents received", description: "Contract documents uploaded by client", date: "9/20/2024" },
      { title: "Review in progress", description: "Legal team reviewing contract terms", date: "10/3/2024" }
    ],
    documents: [
      { name: "Employment Contract.pdf", size: "2.4 MB" },
      { name: "Non-Compete Clause.pdf", size: "1.1 MB" }
    ]
  },

  "0002": {
    title: "Property Dispute",
    caseId: "#0002",
    status: "Completed",
    progress: 100,
    progressMessage: "Your case has been completed!",
    caseType: "Property Dispute",
    createdDate: "8/10/2024",
    lastUpdated: "9/28/2024",
    description: "Boundary dispute resolution with neighbor.",
    updates: [
      { title: "Case opened", description: "Initial assessment completed", date: "8/10/2024" },
      { title: "Case resolved", description: "Settlement agreement reached", date: "9/28/2024" }
    ],
    documents: [
      { name: "Property-Survey.pdf", size: "3.2 MB" },
      { name: "Settlement-Agreement.pdf", size: "1.8 MB" }
    ]
  }
};
