type Immutable<T> = { readonly [K in keyof T]: Immutable<T[K]> };

type TodoItemProps = Immutable<{ text: string }>;

function TodoItem(props: TodoItemProps) {
    return (
    <span>
        { props.text }
    </span>
    )
}

export default TodoItem