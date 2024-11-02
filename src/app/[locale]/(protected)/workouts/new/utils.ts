import { z } from "zod";

const exerciseSchema = z.object({
    name: z.string().min(1, 'Nome do exercício é obrigatório'),
    targetSets: z.coerce
      .number()
      .min(1, 'Mínimo de 1 série')
      .max(10, 'Máximo de 10 séries'),
    targetRepsMin: z.coerce
      .number()
      .min(1, 'Mínimo de 1 repetição')
      .max(100, 'Máximo de 100 repetições'),
    targetRepsMax: z.coerce
      .number()
      .min(1, 'Mínimo de 1 repetição')
      .max(100, 'Máximo de 100 repetições'),
  }).refine(data => {
    return data.targetRepsMax >= data.targetRepsMin;
  }, {
    message: 'O máximo de repetições deve ser maior ou igual ao mínimo',
    path: ['targetRepsMax']
});
  
export const createWorkoutSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    exercises: z.array(exerciseSchema)
        .min(1, 'Adicione pelo menos um exercício'),
})

