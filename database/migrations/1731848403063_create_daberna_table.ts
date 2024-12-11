import { BaseSchema } from '@adonisjs/lucid/schema'
import Helper from '#services/helper_service'

export default class extends BaseSchema {
  protected tableName = 'daberna'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('type', Helper.pluck(Helper.ROOMS, 'type'))
      table.json('boards')
      table.json('numbers')
      table.json('winner_ids').nullable()
      table.json('row_winner_ids').nullable()
      table.integer('player_count').unsigned().defaultTo(0)
      table.integer('card_count').unsigned().defaultTo(0)
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
