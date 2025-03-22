import { BaseSchema } from '@adonisjs/lucid/schema'
import Helper, { pluck } from '#services/helper_service'

export default class extends BaseSchema {
  protected tableName = 'blackjack'

  async up() {
    const players = ['p1', 'p2', 'p3', 'p4']
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('type', pluck(Helper.ROOMS, 'type'))
      players.forEach((p) => {
        table
          .bigInteger(`${p}_id`)
          .nullable()
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
        table.datetime(`${p}_checkout1`)
        table.string(`${p}_action1`, 20)
        table.datetime(`${p}_checkout2`)
        table.string(`${p}_action2`, 20)
        table.enum(`${p}_role`, Helper.USER_ROLES)
      })
      table.string(`action`, 20)
      // table.bigInteger('turn_id').unsigned()
      table.enum('turn_role', Helper.USER_ROLES).nullable()
      table.json('state').nullable()
      table.integer('step').unsigned().defaultTo(0)
      table.timestamps()
    })
    Helper.createBlackJackRooms()
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
