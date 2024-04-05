import "reflect-metadata";
import { injectable } from 'tsyringe'
import type { FeatureFlags } from '@/utils/flags/Flags'

@injectable()
export default class {
  constructor(private _name: FeatureFlags, private _active: boolean, private _defaultvalue: boolean) { }

  public get active(): boolean {
    return this._active
  }

  public set active(value: boolean) {
    this._active = value
  }

  public get name(): FeatureFlags {
    return this._name
  }

  public set name(value: FeatureFlags) {
    this._name = value
  }

  public get defaultvalue(): boolean {
    return this._defaultvalue
  }

  public set defaultvalue(value: boolean) {
    this._defaultvalue = value
  }

  public toObject() {
    return { ...this }
  }
}
