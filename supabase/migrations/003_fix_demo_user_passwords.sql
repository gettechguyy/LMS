-- Reset demo user passwords to Password123! (bcrypt, 12 rounds)
UPDATE "LMS_users"
SET password_hash = '$2a$12$TQakKnLfXCtXL6iBTQH5XeFYI2vxlIjKYuvOvSb6HeBE7rYXzAMrm'
WHERE email IN (
  'admin@techguylms.com',
  'instructor@techguylms.com',
  'mentor@techguylms.com',
  'student@techguylms.com'
);

-- If tables are still lowercase (pre-002 migration), uncomment and run:
-- UPDATE lms_users
-- SET password_hash = '$2a$12$TQakKnLfXCtXL6iBTQH5XeFYI2vxlIjKYuvOvSb6HeBE7rYXzAMrm'
-- WHERE email IN (
--   'admin@techguylms.com',
--   'instructor@techguylms.com',
--   'mentor@techguylms.com',
--   'student@techguylms.com'
-- );
