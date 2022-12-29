export function createWithOptions<T>(instance: T, options: Record<string, any> = {}): T {
    for (const [key, value] of Object.entries(options)) {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
            const obj = instance as any
            if (typeof options[key] !== 'object' || options[key] === null) {
                obj[key] = value
            } else {
                createWithOptions(obj[key], value)
            }
        }
    }
    return instance
}
