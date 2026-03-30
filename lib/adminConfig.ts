// Admin email list - users who have dashboard access
export const ADMIN_EMAILS = [
  'soundmoneyprotocol@proton.me',
  'lefemmeboue@gmail.com',
];

export const isAdminUser = (email: string | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
