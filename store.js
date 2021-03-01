import { panic } from "../system/error.js"

export class Vex {
    constructor({ state = {}, actions = {} }) {
        this.assets = []
        this.map = new WeakMap()

        if (typeof state === 'object' && !Array.isArray(state)) {
            this.state = this.stateHandler(state)
        } else return panic().err('state must be of an object type')

        if (typeof actions === 'object' && !Array.isArray(actions)) {
            this.actions = actions
        } else panic().err('action must be of an object type')
    }

    stateHandler(obj) {
        const map = this.map,
            _this = this

        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                this.stateHandler(obj[key])
            } else {
                this.map.set(obj, { ...obj })

                Object.defineProperty(obj, key, {
                    get() {
                        return map.get(obj)[key]
                    },
                    set(value) {
                        map.get(obj)[key] = value
                        _this.$update()
                    }
                })
            }
        }

        return obj
    }

    $update = () => this.assets.map(asset => asset.$update())

    $use(asset) {
        if (asset.$update) {
            this.assets.push(asset)
        } else {
            console.error('type asset error')
        }
    }
}