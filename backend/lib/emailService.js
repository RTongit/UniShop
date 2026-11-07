import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReservationCodeEmail(to, code, itemTitle) {
  const { data, error } = await resend.emails.send({
    from: "UniShop <onboarding@resend.dev>",
    to,
    subject: `Your reservation code for ${itemTitle}`,
    html: `
      <h2>Reservation confirmed</h2>
      <p>Your code for <strong>${itemTitle}</strong> is:</p>
      <h1>${code}</h1>
      <p>Share this code with the seller only after collecting the item.</p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
 
  return data;
}