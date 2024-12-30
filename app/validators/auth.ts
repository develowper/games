import vine from '@vinejs/vine'

export const passwordValidatorObject = vine.string().minLength(6)
export const usernameValidatorObject = vine
  .string()
  .maxLength(30)
  // .regex(/^(?=.*[A-Za-z])[A-Za-z\d]{5,}$/)
  .unique(async (db, value, fields) => {
    const match = await db
      .from('users')
      .select('id')
      .where((query) => {
        if (fields?.meta?.id) query.whereNot('id', fields.meta.id)
      })
      .where('username', value)
      .first()
    return !match
  })
export const phoneValidatorObject = vine
  .string()
  .regex(/^09[0-9]+$/)
  .fixedLength(11)
  .unique(async (db, value, fields) => {
    const match = await db
      .from('users')
      .select('id')
      .whereNot('id', fields.meta?.id ?? 0)
      .where('phone', value)
      .first()
    return !match
  })

export const registerValidator = vine.compile(
  vine.object({
    phone: phoneValidatorObject,
    username: usernameValidatorObject,
    password: vine
      .string()
      .minLength(6)
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{6,}$/)
      .confirmed(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    // email: vine.string().email().normalizeEmail(),
    username: vine.string().minLength(6),
    password: passwordValidatorObject,
  })
)

export const updateValidator = vine.compile(
  vine.object({
    // email: vine.string().email().normalizeEmail(),
    username: usernameValidatorObject.optional().requiredWhen('type', '=', 'user'),
    phone: phoneValidatorObject.optional().requiredWhen('type', '=', 'user'),
    full_name: vine.string().optional(),
    card: vine
      .string()
      .regex(/^\d{16}$/)
      .fixedLength(16)
      .optional(),
    sheba: vine
      .string()
      .regex(/^\d{24}$/)
      .fixedLength(24)
      .optional(),
    password: vine
      .string()
      .minLength(6)
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{6,}$/)
      .confirmed()
      .optional()
      .requiredWhen('type', '=', 'password'),
  })
)
