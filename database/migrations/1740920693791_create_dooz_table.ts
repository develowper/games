import { BaseSchema } from '@adonisjs/lucid/schema'
import Helper, { pluck } from '#services/helper_service'

export default class extends BaseSchema {
  protected tableName = 'dooz'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .bigInteger('p1_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .bigInteger('p2_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .bigInteger('winner_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.bigInteger('turn_id').unsigned()
      table.smallint('p1_fail_count').unsigned().defaultTo(0)
      table.smallint('p2_fail_count').unsigned().defaultTo(0)
      table.enum('turn_role', Helper.USER_ROLES).nullable()
      table.json('state')
      table.integer('real_total_money').unsigned().defaultTo(0)
      table.integer('prize').unsigned().defaultTo(0)
      table.enum('type', pluck(Helper.ROOMS, 'type'))
      table.enum('action', Helper.DOOZ.actions)
      table.integer('step').unsigned().defaultTo(0)
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
