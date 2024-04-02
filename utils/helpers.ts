import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import type { CmsEntry } from './cms/types'

/**
 * Processes an array of data by creating controller instances and passing them to a repository.
 *
 * @template T The type of each element in the input array.
 * @template C The type of the controller class. Must be a constructor function that takes a `T` as its argument.
 * @template R The type of the repository class. Must be a constructor function that takes an array of `T` as its argument.
 *
 * @param arr The array of data to be processed.
 * @param Controller The controller class to be instantiated for each element in the array.
 * @param Repository The repository class to be instantiated with the processed data.
 *
 * @returns A new instance of the repository class, containing the processed data.
 *
 * @throws If an error occurs while creating a controller instance.
 */
export function processArray<T extends CmsEntry, C extends new (Controller: T) => any, R extends new (Repository: any) => any>(
  arr: T[],
  Controller: C,
  Repository: R,
  Reactivity: boolean = true,
) {
  const instances = arr.map((entry) => {
    try {
      const controller = new Controller(entry)
      if (Reactivity)
        return reactive(controller)
      else
        return controller
    }
    catch (e) {
      if (e instanceof ZodError) {
        const validationError = fromZodError(e)
        console.warn(entry._path, validationError.toString())
      }

      return null
    }
  })
    .filter(Boolean) as C[]

  return new Repository(
    instances,
  )
}
