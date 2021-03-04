import { panic } from "../system/error.js"

export class Vex {
    constructor({ state = {}, actions = {} }) {
        window.$storeSettings = {
            windowName: '$store',
            history: {
                mode: false,
                maxSave: 5
            }
        }

        window.$store = this

        this.assets = []
        this.map = new WeakMap()
        this.history = []

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
                        if ($storeSettings.history.mode) {
                            _this.$historyHandler(JSON.parse(JSON.stringify(_this.state)), key, obj[key], value)
                        }

                        map.get(obj)[key] = value
                        _this.$update()
                    }
                })
            }
        }

        return obj
    }

    $historyHandler(state, key, oldValue, newValue) {
        if (this.history.length === $storeSettings.history.maxSave) this.history.pop()

        if (newValue !== oldValue) {
            this.history.unshift({
                oldState: state,
                name: key,
                newValue,
                oldValue
            })
        }
    }

    $getHistory() {
        return { ...this.history }
    }

    $update() {
        for (const index in this.assets) {
            const asset = this.assets[index]

            asset.$update()
        }
    }

    $use(asset) {
        if (typeof asset === 'object' && !Array.isArray(asset) && asset.$update !== undefined) {
            this.assets.push(asset)
        } else {
            panic().err('The assets you add to the store must be a verb or verb component')
        }
    }
}