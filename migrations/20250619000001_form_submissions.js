/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Create form_submissions table for approval workflow
  await knex.schema.createTable('form_submissions', (table) => {
    table.increments('id').primary();
    
    // Handle UUID generation based on database type
    if (knex.client.config.client === 'pg') {
      table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique();
    } else {
      // For MySQL and other databases
      table.uuid('uuid').defaultTo(knex.raw('(UUID())')).notNullable().unique();
    }
    
    // Inspector details
    table.string('inspector_name', 255).notNullable();
    table.string('inspector_id', 100).notNullable();
    table.string('inspector_email', 255).notNullable();
    table.string('inspector_image', 500).nullable(); // File path for inspector image
    table.timestamp('date_time').notNullable();
    
    // Site details
    table.string('geolocation', 100).nullable(); // Latitude, Longitude coordinates
    table.string('site', 50).nullable(); // Site/substation code (e.g., APC, SSA, FTA)
    
    // Inspection details
    table.string('inspection_type', 100).notNullable();
    table.text('remarks').nullable(); // Inspection remarks/notes
    table.string('inspection_image', 500).nullable(); // File path for inspection image
    table.integer('submitted_by').unsigned().notNullable();
    table.foreign('submitted_by').references('id').inTable('users').onDelete('CASCADE');
    
    table.string('status', 50).defaultTo('pending').notNullable(); // pending, approved, rejected
    table.integer('reviewed_by').unsigned().nullable();
    table.foreign('reviewed_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('reviewed_at').nullable();
    table.text('review_notes').nullable();
    
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    
    // Indexes for better performance
    table.index(['status']);
    table.index(['submitted_by']);
    table.index(['reviewed_by']);
    table.index(['created_at']);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('form_submissions');
}