import vine from '@vinejs/vine'
import { phoneValidatorObject, usernameValidatorObject } from '#validators/auth'
import collect from 'collect.js'
import Helper from '#services/helper_service'

export const updateUserValidator = vine.compile(
  vine.object({
    // email: vine.string().email().normalizeEmail(),
    username: usernameValidatorObject,
    phone: phoneValidatorObject.optional(),
    full_name: vine.string().optional(),
    status: vine.string().in(collect(Helper.USER_STATUSES).pluck('name').toArray()),
    role: vine.string().in(Helper.USER_ROLES),
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
      .optional()
      .requiredWhen('password', '!=', null),
  })
)
export const createUserValidator = vine.compile(
  vine.object({
    // email: vine.string().email().normalizeEmail(),
    username: usernameValidatorObject,
    phone: phoneValidatorObject.optional(),
    full_name: vine.string().optional(),
    role: vine.string().in(Helper.USER_ROLES),
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
      .confirmed()
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{6,}$/),
  })
)
