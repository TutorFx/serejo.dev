import 'reflect-metadata'
import type { FeatureFlags } from './Flags'
import type FlagsController from './FlagsController'

export default class {
  private _flagsRepository: FlagsController[] = []

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

  constructor(flags: FlagsController[]) {
    this._flagsRepository = flags
  }
}
