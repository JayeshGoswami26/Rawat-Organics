'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { config, validateEnv } = require('../config/environment');
const Permission = require('../models/permission.model');
const Role = require('../models/role.model');
const User = require('../models/user.model');

const SYSTEM_PERMISSIONS = [
  { resource: 'users', action: 'read', description: 'View users' },
  { resource: 'users', action: 'create', description: 'Create users' },
  { resource: 'users', action: 'update', description: 'Update users' },
  { resource: 'users', action: 'delete', description: 'Delete users' },
  { resource: 'roles', action: 'read', description: 'View roles' },
  { resource: 'roles', action: 'create', description: 'Create roles' },
  { resource: 'roles', action: 'update', description: 'Update roles' },
  { resource: 'roles', action: 'delete', description: 'Delete roles' },
  { resource: 'permissions', action: 'read', description: 'View permissions' },
  { resource: 'permissions', action: 'create', description: 'Create permissions' },
  { resource: 'permissions', action: 'update', description: 'Update permissions' },
  { resource: 'permissions', action: 'delete', description: 'Delete permissions' },
  { resource: 'products', action: 'read', description: 'View products' },
  { resource: 'products', action: 'create', description: 'Create products' },
  { resource: 'products', action: 'update', description: 'Update products' },
  { resource: 'products', action: 'delete', description: 'Delete products' },
  { resource: 'orders', action: 'read', description: 'View orders' },
  { resource: 'orders', action: 'create', description: 'Create orders' },
  { resource: 'orders', action: 'update', description: 'Update orders' },
  { resource: 'orders', action: 'delete', description: 'Delete orders' },
  { resource: 'categories', action: 'read', description: 'View categories' },
  { resource: 'categories', action: 'create', description: 'Create categories' },
  { resource: 'categories', action: 'update', description: 'Update categories' },
  { resource: 'categories', action: 'delete', description: 'Delete categories' },
  { resource: 'inquiries', action: 'read', description: 'View inquiries' },
  { resource: 'inquiries', action: 'update', description: 'Update inquiry status' },
  { resource: 'analytics', action: 'read', description: 'View analytics data' },
  { resource: 'media', action: 'create', description: 'Upload media files' },
];

const seed = async () => {
  validateEnv();
  await mongoose.connect(config.db.uri);
  console.log('Connected to MongoDB');

  // Upsert all permissions
  const permDocs = await Promise.all(
    SYSTEM_PERMISSIONS.map(({ resource, action, description }) =>
      Permission.findOneAndUpdate(
        { name: `${resource}:${action}` },
        { name: `${resource}:${action}`, resource, action, description, isSystem: true },
        { upsert: true, new: true }
      )
    )
  );
  console.log(`✓ Seeded ${permDocs.length} permissions`);

  const byName = Object.fromEntries(permDocs.map((p) => [p.name, p._id]));
  const allIds = permDocs.map((p) => p._id);

  // super_admin: every permission
  const superAdminRole = await Role.findOneAndUpdate(
    { name: 'super_admin' },
    {
      name: 'super_admin',
      displayName: 'Super Admin',
      description: 'Unrestricted system access',
      permissions: allIds,
      isSystem: true,
    },
    { upsert: true, new: true }
  );

  // admin: everything except permissions:delete
  const adminPerms = allIds.filter((id) => !id.equals(byName['permissions:delete']));
  const adminRole = await Role.findOneAndUpdate(
    { name: 'admin' },
    {
      name: 'admin',
      displayName: 'Admin',
      description: 'Administrative access without destructive permission control',
      permissions: adminPerms,
      isSystem: true,
    },
    { upsert: true, new: true }
  );

  // customer: browse products + place orders
  const customerRole = await Role.findOneAndUpdate(
    { name: 'customer' },
    {
      name: 'customer',
      displayName: 'Customer',
      description: 'Standard customer access',
      permissions: [byName['products:read'], byName['orders:create'], byName['orders:read']].filter(Boolean),
      isSystem: true,
    },
    { upsert: true, new: true }
  );

  console.log('✓ Seeded roles: super_admin, admin, customer');

  // Seed super admin user
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@rawatorganics.com';
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123456';

  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12),
      roles: [superAdminRole._id],
      isActive: true,
      isEmailVerified: true,
    },
    { upsert: true }
  );

  console.log(`✓ Super admin ready: ${adminEmail} / ${adminPassword}`);
  console.log('\nSeed complete!');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
