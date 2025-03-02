import zod from 'zod'

export const signUp = zod.object({
    email: zod.string().email(),
    fullName: zod.string(),
    password: zod.string().max(8)
})

export const logIn = zod.object({
    email: zod.string().email(),
    password: zod.string().max(8)
})

