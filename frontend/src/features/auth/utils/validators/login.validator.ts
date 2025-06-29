import * as z from 'zod'

const schema = z.object({
    identifier: z.string()
        .nonempty({ message: 'Это поле обязательно' }),

    password: z.string()
        .nonempty({ message: 'Укажите пароль' })
})

export default schema