
exports.up = function(knex) {
  return knex.schema.createTable("reviews", (table) => {
    table.increments("review_id").primary();                 // Sets review_id as primary key
    table.text("content");
    table.integer("score");
    table.integer("critic_id").unsigned().notNullable();
    table                                                    // Sets critic_id as a foreign key that references the critics table
        .foreign("critic_id")
        .references("critic_id")
        .inTable("critics")
        .onDelete("cascade");
    table.integer("movie_id").unsigned().notNullable();
    table                                                    // Sets movie_id as a foreign key that references the movies table
        .foreign("movie_id")
        .references("movie_id")
        .inTable("movies")
        .onDelete("cascade");
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("reviews");
};
