import * as z from 'zod';

const schema = z.object({
  username: z.string()
    .min(3, { message: 'Минимум 3 символа' })
    .nonempty({ message: 'Имя обязательно' }),
  
  email: z.string()
    .email({ message: 'Некорректный email' })
    .nonempty({ message: 'Почта обязательна' }),

  password: z.string()
    .min(6, { message: 'Минимум 6 символов' })
    .nonempty({ message: 'Пароль обязателен' }),
})

export default schema