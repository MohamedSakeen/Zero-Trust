import { db } from './index';
import { users } from './schema';
import * as bcrypt from 'bcrypt';

/**
 * Seed the database with initial data
 * This script creates default admin, faculty, and student accounts
 */
async function seed() {
  console.log('Seeding database...');

  try {
    // Hash passwords
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create admin user
    const [admin] = await db.insert(users).values({
      email: 'admin@university.edu',
      passwordHash: hashedPassword,
      name: 'System Administrator',
      role: 'admin',
      department: 'IT',
      status: 'active',
    }).returning();
    console.log('✓ Created admin user:', admin.email);

    // Create faculty user
    const [faculty] = await db.insert(users).values({
      email: 'faculty@university.edu',
      passwordHash: hashedPassword,
      name: 'Dr. Jane Smith',
      role: 'faculty',
      department: 'Computer Science',
      status: 'active',
    }).returning();
    console.log('✓ Created faculty user:', faculty.email);

    // Create student user
    const [student] = await db.insert(users).values({
      email: 'student@university.edu',
      passwordHash: hashedPassword,
      name: 'John Doe',
      role: 'student',
      department: 'Computer Science',
      status: 'active',
    }).returning();
    console.log('✓ Created student user:', student.email);

    console.log('\n✓ Database seeded successfully');
    console.log('\nDefault credentials:');
    console.log('  Admin:   admin@university.edu / password123');
    console.log('  Faculty: faculty@university.edu / password123');
    console.log('  Student: student@university.edu / password123');
    console.log('\n⚠️  Remember to change these passwords in production!');

  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
