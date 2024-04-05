import type { FeatureFlags } from '@/utils/flags/Flags'

export default class {
  private _name
  private _active
  private _defaultvalue

  constructor(name: FeatureFlags, active: boolean, defaultvalue: boolean) {
    this._name = name
    this._active = active
    this._defaultvalue = defaultvalue
  }

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
