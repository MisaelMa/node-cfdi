export class Catalogo<T> {
    private data: Record<string, T> = {}
    constructor(value: T) {}

    get label(): string {
        return ''
    }

    get value(): string {
        return ''
    }
}