export const chatResponses = {
    cpt: `CPT allows F-1 students to work off-campus as part of their curriculum.

Steps:
1. Get a job offer letter
2. Register for a CPT-eligible course
3. Submit your CPT request to CGCE
4. Wait for approval on your I-20
5. Do not start work before authorization`,

    opt: `OPT lets F-1 students work in their field after graduation.

You can apply up to 90 days before graduation. STEM students may qualify for a 24-month extension.`,

    jobs: `You can explore on-campus jobs, internships, graduate assistantships, and CPT-friendly roles from the Jobs page.`,

    visa: `Important F-1 reminders:
- Stay full-time enrolled
- Do not work off-campus without CPT/OPT
- Keep your passport valid
- Report address changes
- Get a travel signature before international travel`,

    default: `I can help with CPT, OPT, F-1 rules, jobs, events, and international student resources. Try asking: “How do I apply for CPT?”`,
};

export function getBotResponse(message) {
    const text = message.toLowerCase();

    if (text.includes("cpt")) return chatResponses.cpt;
    if (text.includes("opt")) return chatResponses.opt;
    if (text.includes("job") || text.includes("work") || text.includes("internship")) return chatResponses.jobs;
    if (text.includes("visa") || text.includes("f-1") || text.includes("f1")) return chatResponses.visa;

    return chatResponses.default;
}