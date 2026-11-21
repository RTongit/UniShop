import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendReservationCodeEmail(
  to,
  code,
  itemTitle,
  pickupLocation,
  price,
  sellerName,
) {
  const safeItemTitle = escapeHtml(itemTitle);
  const safePickupLocation = escapeHtml(pickupLocation);
  const safeSellerName = escapeHtml(sellerName);
  const formattedPrice = Number(price).toLocaleString("en-IN");

  const { data, error } = await resend.emails.send({
    from: "UniShop <onboarding@resend.dev>",
    to,
    subject: `Your reservation code for ${itemTitle}`,
    html: `
      <h2>Reservation confirmed</h2>
      <p>Your reservation details:</p>
      <p><strong>Item:</strong> ${safeItemTitle}</p>
      <p><strong>Price:</strong> ₹${formattedPrice}</p>
      <p><strong>Seller:</strong> ${safeSellerName}</p>
      <p><strong>Pickup location:</strong> ${safePickupLocation}</p>
      <p>Your verification code is:</p>
      <h1>${code}</h1>
      <p>Share this code with the seller only after collecting the item.</p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
 
  return data;
}

async function sendPasswordResetEmail(to, resetUrl) {
  const safeResetUrl = escapeHtml(resetUrl);

  const { data, error } = await resend.emails.send({
    from: "UniShop <onboarding@resend.dev>",
    to,
    subject: "Reset your UniShop password",
    html: `
      <h2>Password reset request</h2>
      <p>Click the link below to set a new password:</p>
      <p><a href="${safeResetUrl}">Reset password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export {sendReservationCodeEmail,sendPasswordResetEmail}
