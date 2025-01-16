import vine from '@vinejs/vine'
import Helper from '#services/helper_service'

export const buyCardValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
    slug: vine.string().trim(),
    description: vine.string().trim().escape(),
  })
)

export const createRoomValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
    slug: vine.string().trim(),
    description: vine.string().trim().escape(),
  })
)
export const updateRoomValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(100),
    status: vine.string().in(Helper.pluck(Helper.ROOM_STATUSES, 'name')),
    card_price: vine.number().withoutDecimals().min(0),
    max_cards_count: vine.number().withoutDecimals().min(2),
    max_user_cards_count: vine.number().withoutDecimals().min(1),
    win_score: vine.number().withoutDecimals().min(0),
    max_seconds: vine.number().withoutDecimals().min(0),
    commission_percent: vine.number().withoutDecimals().min(0),
    row_win_percent: vine.number().withoutDecimals().min(0),
    win_percent: vine.number().withoutDecimals().min(0),
    bot_percent: vine.number().withoutDecimals().min(0),
    rwp: vine.number().withoutDecimals().min(0),
  })
)
