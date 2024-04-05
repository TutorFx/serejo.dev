import 'reflect-metadata'

import { injectAll, injectable } from 'tsyringe'

import type { FeatureFlags } from '@/utils/flags/Flags'
import FlagsController from '@/utils/flags/FlagsController'

@injectable()
export default class {
  public get flagsRepository(): FlagsController[] {
    return this._flagsRepository
  }

  public set flagsRepository(value: FlagsController[]) {
    this._flagsRepository = value
  }

  public check(name: FeatureFlags) {
    const flag = this.flagsRepository.find(flag => flag.name === name)

    if (!flag)
      throw createError(`Flag ${name} not registered`)

    return flag.active
  }

  constructor(@injectAll(FlagsController)
        private _flagsRepository: FlagsController[]) {}
}
