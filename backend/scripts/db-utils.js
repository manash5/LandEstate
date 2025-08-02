#!/usr/bin/env node

/**
 * Database Utility CLI
 * This script provides a command-line interface for database utilities
 * Usage: node scripts/db-utils.js <command>
 * 
 * Available commands:
 * - seed: Seed the database with initial data
 * - create-conversations: Create initial conversations between employees and managers
 * - diagnostics: Get database diagnostics
 * - migrate: Run database migrations
 * - health: Check database health
 * - reset: Reset database (DANGEROUS - deletes all data)
 */

import { 
    seedDatabase, 
    createInitialConversations, 
    getDatabaseDiagnostics 
} from '../src/utils/databaseSeeder.js';
import { 
    runMigrations, 
    resetDatabase, 
    checkDatabaseHealth 
} from '../src/utils/databaseMigrations.js';

const [,, command] = process.argv;

async function runCommand() {
    try {
        switch (command) {
            case 'seed':
                console.log('🌱 Seeding database...');
                const seedResult = await seedDatabase();
                console.log('✅ Database seeded successfully');
                console.log(JSON.stringify(seedResult, null, 2));
                break;

            case 'create-conversations':
                console.log('💬 Creating initial conversations...');
                const convResult = await createInitialConversations();
                console.log('✅ Initial conversations created');
                console.log(JSON.stringify(convResult, null, 2));
                break;

            case 'diagnostics':
                console.log('🔍 Getting database diagnostics...');
                const diagnostics = await getDatabaseDiagnostics();
                console.log('✅ Database diagnostics retrieved');
                console.log(JSON.stringify(diagnostics, null, 2));
                break;

            case 'migrate':
                console.log('🚀 Running database migrations...');
                const migrateResult = await runMigrations();
                console.log('✅ Migrations completed');
                console.log(JSON.stringify(migrateResult, null, 2));
                break;

            case 'health':
                console.log('🏥 Checking database health...');
                const health = await checkDatabaseHealth();
                console.log(health.success ? '✅ Database is healthy' : '❌ Database has issues');
                console.log(JSON.stringify(health, null, 2));
                break;

            case 'reset':
                console.log('⚠️  WARNING: This will delete ALL data from the database!');
                console.log('⚠️  Type "YES" to confirm or anything else to cancel:');
                
                const readline = require('readline');
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                
                rl.question('Confirm reset: ', async (answer) => {
                    if (answer === 'YES') {
                        console.log('🗑️  Resetting database...');
                        const resetResult = await resetDatabase();
                        console.log('✅ Database reset completed');
                        console.log(JSON.stringify(resetResult, null, 2));
                    } else {
                        console.log('❌ Database reset cancelled');
                    }
                    rl.close();
                    process.exit(0);
                });
                return; // Don't exit yet, wait for user input

            default:
                console.log('❌ Unknown command:', command);
                console.log('\nAvailable commands:');
                console.log('  seed                - Seed database with initial data');
                console.log('  create-conversations - Create initial conversations');
                console.log('  diagnostics         - Get database diagnostics');
                console.log('  migrate             - Run database migrations');
                console.log('  health              - Check database health');
                console.log('  reset               - Reset database (DANGEROUS)');
                console.log('\nUsage: node scripts/db-utils.js <command>');
                process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runCommand().then(() => {
        if (command !== 'reset') {
            process.exit(0);
        }
    });
}
