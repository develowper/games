import vine from '@vinejs/vine'

export const updateSettingValidator = vine.compile(
  vine.object({
    id: vine.number().withoutDecimals(),
    title: vine.string().trim().maxLength(250),
    key: vine.string().trim().maxLength(250),
    value: vine.string(),
  })
)
