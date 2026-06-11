import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  role: text('role').notNull().default('employee'), // 'employee', 'admin', 'hr'
  name: text('name').notNull().default(''),
  tenantId: text('tenant_id').notNull().default('default-tenant'),
  telegramId: text('telegram_id'), // For Telegraf bot
  nfcCardId: text('nfc_card_id'),
  qrKey: text('qr_key'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(), // unique employee code
  name: text('name').notNull(),
  department: text('department').notNull(),
  telegramId: text('telegram_id'),
  active: boolean('active').default(true),
});

export const attendanceLogs = pgTable('attendance_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  employeeCode: text('employee_code').references(() => employees.code),
  tenantId: text('tenant_id').notNull().default('default-tenant'),
  type: text('type').notNull(), // 'check_in', 'check_out'

  method: text('method').notNull(), // 'gps', 'face', 'qr', 'nfc'
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  locationLat: text('location_lat'),
  locationLng: text('location_lng'),
  photoUrl: text('photo_url'), // For AI face match reference
  status: text('status').notNull().default('present'), 
});

export const payrollRecords = pgTable('payroll_records', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  tenantId: text('tenant_id').notNull(),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  baseSalary: text('base_salary').notNull().default('0'),
  deductions: text('deductions').notNull().default('0'),
  netPay: text('net_pay').notNull().default('0'),
  status: text('status').notNull().default('pending'), // 'pending', 'paid'
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  attendanceLogs: many(attendanceLogs),
  payrollRecords: many(payrollRecords),
}));

export const attendanceLogsRelations = relations(attendanceLogs, ({ one }) => ({
  user: one(users, {
    fields: [attendanceLogs.userId],
    references: [users.id],
  }),
}));

export const payrollRecordsRelations = relations(payrollRecords, ({ one }) => ({
  user: one(users, {
    fields: [payrollRecords.userId],
    references: [users.id],
  }),
}));
