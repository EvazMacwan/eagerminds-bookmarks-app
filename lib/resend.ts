import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

export async function sendWelcomeEmail(email: string) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is not configured");
  }

  const resend = getResend();

  const { error } = await resend.emails.send({
    from: `BookmarkHub <${from}>`,
    to: email,
    subject: "Welcome to BookmarkHub",
    html: `
      <h1>Welcome to BookmarkHub!</h1>
      <p>Thanks for signing up. Confirm your email using the link Supabase sent you, then sign in to start saving bookmarks.</p>
      <p>Once you're in, you can add links, mark them public or private, and share your public profile with others.</p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
